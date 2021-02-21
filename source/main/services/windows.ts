import path from "path";
import { BrowserWindow } from "electron";
import { VaultSourceID } from "buttercup";
import debounce from "debounce";
import { getConfigValue, setConfigValue} from "./config";

async function createVaultWindow() {
    const width = await getConfigValue<number>("windowWidth");
    const height = await getConfigValue<number>("windowHeight");
    const win = new BrowserWindow({
        width,
        height,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            spellcheck: false
        }
    })
    win.on("resize", debounce(() => handleWindowResize(win), 750, false));
    const loadedPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Timed-out waiting for window to load")), 10000);
        win.webContents.once("did-finish-load", () => {
            clearTimeout(timeout);
            resolve();
        });
    });
    win.loadFile(path.resolve(__dirname, "../../renderer/index.html"));
    await loadedPromise;
}

async function handleWindowResize(win: BrowserWindow) {
    const [newWidth, newHeight] = win.getSize();
    await setConfigValue("windowWidth", newWidth);
    await setConfigValue("windowHeight", newHeight);
}

export function notifyWindowsOfSourceUpdate(sourceID: VaultSourceID) {
    BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send("source-updated", sourceID);
    });
}

export async function openMainWindow(targetRoute: string = null): Promise<BrowserWindow> {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
        await createVaultWindow();
    } else {
        windows[0].show();
        windows[0].focus();
    }
    if (targetRoute) {
        const [currentURL] = windows[0].webContents.getURL().split("#");
        windows[0].loadURL(`${currentURL}#${targetRoute}`);
    }
    return windows[0];
}
