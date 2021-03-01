import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk, onSourcesUpdated } from "./buttercup";
import { initialise as initialiseLogging } from "./log";
import { logInfo } from "../library/log";
import { applyCurrentTheme } from "./theme";
import { updateTrayIcon } from "../actions/tray";
import { updateAppMenu } from "../actions/appMenu";

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
    await updateAppMenu();
    onSourcesUpdated(async () => {
        await updateAppMenu();
        await updateTrayIcon();
    });
    await applyCurrentTheme();
    logInfo("Initialisation completed");
}
