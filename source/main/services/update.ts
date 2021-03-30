import path from "path";
import { app } from "electron";
import { UpdateInfo, autoUpdater } from "electron-updater";
import isDev from "electron-is-dev";
import { logErr, logInfo } from "../library/log";
import { fileExists } from "../library/file";

let __eventListenersAttached = false,
    __currentUpdate: UpdateInfo = null,
    __updateMuted: boolean = false;
    // __updater: AppUpdater = null;

function attachEventListeners(updater = autoUpdater) {
    updater.on("error", err => {
        logErr("Error processing update", err);
    });
    updater.on("update-available", (updateInfo: UpdateInfo) => {
        logInfo(`Update available: ${updateInfo.version} (${updateInfo.releaseDate})`);
    });
    updater.on("update-not-available", () => {
        logInfo("No update available");
    });
}

export async function checkForUpdate() {
    if (!__eventListenersAttached) {
        __eventListenersAttached = true;
        attachEventListeners();
    }
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL({
        provider: "github",
        owner: "buttercup",
        repo: "desktop-v2-beta"
    });
    if (isDev) {
        const hasDevConfig = await hasDevUpdate();
        if (!hasDevConfig) {
            logInfo("Will not check for updates: In dev mode with no dev-app-update.yml");
            return;
        }
    }
    logInfo("Checking for updates");
    autoUpdater.checkForUpdates();
}

export function getCurrentUpdate(): UpdateInfo {
    return !__updateMuted && __currentUpdate ? __currentUpdate : null;
}

// function getUpdater(): AppUpdater {
//     if (!__updater) {
//         __updater = new AppUpdater({

//         });
//     }
// }

async function hasDevUpdate(): Promise<boolean> {
    return fileExists(path.join(app.getAppPath(), "dev-app-update.yml"));
}

export function muteUpdate() {
    logInfo("Update notification muted");
    __updateMuted = true;
}
