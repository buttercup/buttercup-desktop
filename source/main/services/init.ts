import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk, onSourcesUpdated } from "./buttercup";
import { initialise as initialiseLogging } from "./log";
import { logInfo } from "../library/log";
import { updateTrayIcon } from "../actions/tray";

export async function initialise() {
    await initialiseLogging();
    logInfo("Application session started:", new Date());
    attachVaultManagerWatchers();
    await loadVaultsFromDisk();
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders["Origin"] = "https://desktop.buttercup.pw/v2";
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
    await updateTrayIcon();
    onSourcesUpdated(async () => {
        await updateTrayIcon();
    });
    logInfo("Initialisation completed");
}
