import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk, onSourcesUpdated } from "./buttercup";
import { initialise as initialiseLogging } from "./log";
import { logInfo } from "../library/log";
import { applyCurrentTheme } from "./theme";
import { updateTrayIcon } from "../actions/tray";
import { updateAppMenu } from "../actions/appMenu";
import { getConfigValue } from "./config";
import { initialise as initialiseI18n } from "../../shared/i18n/trans";
import { DEFAULT_LANGUAGE } from "../../shared/symbols";

export async function initialise() {
    await initialiseLogging();
    logInfo("Application session started:", new Date());
    const preferredLang = await getConfigValue<string>("language");
    const language = preferredLang || DEFAULT_LANGUAGE;
    logInfo(`Starting with language: ${language}`);
    await initialiseI18n(language);
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
