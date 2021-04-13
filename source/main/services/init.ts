import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk, onSourcesUpdated } from "./buttercup";
import { initialise as initialiseLogging } from "./log";
import { logInfo } from "../library/log";
import { applyCurrentTheme } from "./theme";
import { updateTrayIcon } from "../actions/tray";
import { updateAppMenu } from "../actions/appMenu";
import { getConfigValue } from "./config";
import { getOSLocale } from "./locale";
import { startFileHost } from "./fileHost";
import { isPortable } from "../library/portability";
import { getLogPath } from "./log";
import { startUpdateWatcher } from "./update";
import { registerGoogleDriveAuthHandlers } from "./googleDrive";
import { initialise as initialiseI18n, onLanguageChanged } from "../../shared/i18n/trans";
import { getLanguage } from "../../shared/library/i18n";
import { Preferences } from "../types";

export async function initialise() {
    await initialiseLogging();
    logInfo("Application session started:", new Date());
    logInfo(`Logs location: ${getLogPath()}`);
    const preferences = await getConfigValue<Preferences>("preferences");
    const locale = await getOSLocale();
    logInfo(`System locale detected: ${locale}`);
    const language = getLanguage(preferences, locale);
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
    onLanguageChanged(async () => {
        await updateTrayIcon();
        await updateAppMenu();
    });
    await applyCurrentTheme();
    if (preferences.fileHostEnabled) {
        await startFileHost();
    }
    registerGoogleDriveAuthHandlers();
    logInfo(`Portable mode: ${isPortable() ? "yes" : "no"}`);
    setTimeout(() => startUpdateWatcher(), 0);
    logInfo("Initialisation completed");
}
