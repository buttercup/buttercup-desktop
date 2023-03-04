import { session } from "electron";
import { attachVaultManagerWatchers, loadVaultsFromDisk, onSourcesUpdated } from "./buttercup";
import { initialise as initialiseLogging } from "./log";
import { logInfo } from "../library/log";
import { applyCurrentTheme } from "./theme";
import { updateTrayIcon } from "../actions/tray";
import { updateAppMenu } from "../actions/appMenu";
import { getConfigValue, initialise as initialiseConfig } from "./config";
import { getConfigPath, getVaultStoragePath } from "./storage";
import { getOSLocale } from "./locale";
import { startFileHost } from "./fileHost";
import { isPortable } from "../library/portability";
import { getLogPath } from "./log";
import { startUpdateWatcher } from "./update";
import { registerGoogleDriveAuthHandlers } from "./googleDrive";
import { processCLFlags } from "./arguments";
import { supportsBiometricUnlock } from "./biometrics";
import { startAutoVaultLockTimer } from "./autoLock";
import { start as startBrowserAPI } from "./browser/index";
import { initialise as initialiseI18n, onLanguageChanged } from "../../shared/i18n/trans";
import { getLanguage } from "../../shared/library/i18n";

export async function initialise() {
    processCLFlags();
    await initialiseLogging();
    logInfo("Application session started:", new Date());
    logInfo(`Logs location: ${getLogPath()}`);
    logInfo(`Config location: ${getConfigPath()}`);
    logInfo(`Vault config storage location: ${getVaultStoragePath()}`);
    await initialiseConfig();
    const preferences = await getConfigValue("preferences");
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
    if (preferences.browserAPIEnabled) {
        await startBrowserAPI();
    }
    registerGoogleDriveAuthHandlers();
    logInfo(`Portable mode: ${isPortable() ? "yes" : "no"}`);
    logInfo(`Biometrics: ${supportsBiometricUnlock() ? "yes" : "no"}`);
    setTimeout(() => startUpdateWatcher(), 0);
    logInfo(
        `Auto-lock: ${
            preferences.lockVaultsAfterTime ? preferences.lockVaultsAfterTime + "s" : "no"
        }`
    );
    startAutoVaultLockTimer();
    logInfo("Initialisation completed");
}
