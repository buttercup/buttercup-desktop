import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk } from "./buttercup";

export async function initialise() {
    attachVaultManagerWatchers();
    await loadVaultsFromDisk();
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders["Origin"] = "https://desktop.buttercup.pw/v2";
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
}
