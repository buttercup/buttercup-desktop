import path from "path";
import { app } from "electron";
import { UpdateInfo, autoUpdater } from "electron-updater";
import isDev from "electron-is-dev";
import debounce from "debounce-promise";
import ms from "ms";
import { clearDelayedInterval, setDelayedInterval } from "delayable-setinterval";
import { getMainWindow } from "./windows";
import { logErr, logInfo, logWarn } from "../library/log";
import { fileExists } from "../library/file";
import { UpdateProgressInfo } from "../types";

const UPDATE_AUTO_CHECK = ms("30m");

export const checkForUpdate = debounce(checkForUpdateInternal, 2500);

let __eventListenersAttached = false,
    __currentUpdate: UpdateInfo = null,
    __readyUpdate: UpdateInfo = null,
    __updateCheckTimer: string = null,
    __updateErrored: boolean = false,
    __updateMuted: boolean = false;

function attachEventListeners(updater = autoUpdater) {
    updater.on("error", (err: Error) => {
        logErr("Error processing update", err);
        __updateErrored = true;
        const win = getMainWindow();
        if (win) {
            win.webContents.send("update-error", err.message);
        }
    });
    updater.on("download-progress", (progress: UpdateProgressInfo) => {
        const win = getMainWindow();
        if (win) {
            win.webContents.send("update-progress", JSON.stringify(progress));
        }
    });
    updater.on("update-available", (updateInfo: UpdateInfo) => {
        console.log(JSON.stringify(updateInfo, undefined, 2));
        logInfo(`Update available: ${updateInfo.version} (${updateInfo.releaseDate})`);
        const win = getMainWindow();
        if (win) {
            win.webContents.send("update-available", JSON.stringify(updateInfo));
        }
    });
    updater.on("update-not-available", () => {
        logInfo("No update available");
    });
    updater.on("update-downloaded", (updateInfo: UpdateInfo) => {
        logInfo(`Update downloaded: ${updateInfo.version}`);
        const win = getMainWindow();
        if (win) {
            win.webContents.send("update-progress", JSON.stringify(null));
        }
        if (__updateErrored) {
            logWarn("Skipping update-ready notification due to preview error");
            return;
        }
        __readyUpdate = updateInfo;
        __currentUpdate = null;
        if (win) {
            win.webContents.send("update-downloaded", JSON.stringify(updateInfo));
        }
    });
}

async function checkForUpdateInternal() {
    if (!__eventListenersAttached) {
        __eventListenersAttached = true;
        attachEventListeners();
    }
    __currentUpdate = null;
    __readyUpdate = null;
    __updateErrored = false;
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL({
        provider: "github",
        owner: "buttercup",
        repo: "buttercup-desktop"
    });
    if (isDev) {
        const hasDevConfig = await hasDevUpdate();
        if (!hasDevConfig) {
            logInfo("Will not check for updates: In dev mode with no dev-app-update.yml");
            return;
        }
    }
    logInfo("Checking for updates");
    await autoUpdater.checkForUpdates();
}

export function getCurrentUpdate(): UpdateInfo {
    return !__updateMuted && __currentUpdate ? __currentUpdate : null;
}

export function getReadyUpdate(): UpdateInfo {
    return __readyUpdate;
}

async function hasDevUpdate(): Promise<boolean> {
    return fileExists(path.join(app.getAppPath(), "dev-app-update.yml"));
}

export function installUpdate() {
    autoUpdater.quitAndInstall();
}

export function muteUpdate() {
    logInfo("Update notification muted");
    __updateMuted = true;
}

export async function startUpdate(): Promise<void> {
    await autoUpdater.downloadUpdate();
}

export async function startUpdateWatcher(): Promise<void> {
    await checkForUpdate();
    __updateCheckTimer = setDelayedInterval(checkForUpdate, UPDATE_AUTO_CHECK);
}

export function stopUpdateWatcher(): void {
    clearDelayedInterval(__updateCheckTimer);
}
