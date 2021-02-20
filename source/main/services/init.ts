import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk, onSourcesUpdated } from "./buttercup";
import { updateTrayIcon } from "../actions/tray";

export async function initialise() {
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
}
