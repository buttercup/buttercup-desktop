import path from "path";
import { BrowserWindow } from "electron";
import { VaultSourceID } from "buttercup";
import debounce from "debounce";
import { getConfigValue, setConfigValue } from "./config";
import { getIconPath } from "../library/tray";
import { lockAllSources } from "./buttercup";
import { setLastSourceID } from "./lastVault";
import { logErr, logInfo } from "../library/log";
import { Preferences } from "../types";

export async function closeWindows(): Promise<void> {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => {
        win.close();
    });
}

async function createVaultWindow() {
    const width = await getConfigValue<number>("windowWidth");
    const height = await getConfigValue<number>("windowHeight");
    const win = new BrowserWindow({
        width,
        height,
        icon: getIconPath(),
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            spellcheck: false
        }
    });
    win.on("closed", () => {
        win.removeAllListeners();
        handleWindowClosed();
    });
    win.on(
        "resize",
        debounce(() => handleWindowResize(win), 750, false)
    );
    const loadedPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
            () => reject(new Error("Timed-out waiting for window to load")),
            10000
        );
        win.webContents.once("did-finish-load", () => {
            clearTimeout(timeout);
            resolve();
        });
    });
    win.loadFile(path.resolve(__dirname, "../../renderer/index.html"));
    await loadedPromise;
}

export function getMainWindow(): BrowserWindow {
    const [win = null] = BrowserWindow.getAllWindows();
    return win;
}

async function handleWindowClosed() {
    const preferences: Preferences = await getConfigValue("preferences");
    if (preferences.lockVaultsOnWindowClose) {
        logInfo("Locking vaults on window close");
        try {
            await lockAllSources();
        } catch (err) {
            logErr("Failed locking vaults on window close", err);
        }
    }
    setLastSourceID(null);
}

async function handleWindowResize(win: BrowserWindow) {
    const [newWidth, newHeight] = win.getSize();
    await setConfigValue("windowWidth", newWidth);
    await setConfigValue("windowHeight", newHeight);
}

export function notifyWindowsOfSourceUpdate(sourceID: VaultSourceID) {
    BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("source-updated", sourceID);
    });
}

export async function openMainWindow(targetRoute: string = null): Promise<BrowserWindow> {
    let windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
        await createVaultWindow();
        windows = BrowserWindow.getAllWindows();
    } else {
        windows[0].show();
        windows[0].focus();
    }
    if (targetRoute) {
        windows[0].webContents.send("route", targetRoute);
    }
    return windows[0];
}
