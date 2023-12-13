import { logInfo } from "../library/log";
import { applyCurrentTheme } from "../services/theme";
import { getOSLocale } from "../services/locale";
import { changeLanguage } from "../../shared/i18n/trans";
import { getLanguage } from "../../shared/library/i18n";
import { startFileHost, stopFileHost } from "../services/fileHost";
import { setStartWithSession } from "../services/launch";
import { start as startBrowserAPI, stop as stopBrowserAPI } from "../services/browser/index";
import { Preferences } from "../types";

export async function handleConfigUpdate(preferences: Preferences) {
    logInfo("Config updated");
    applyCurrentTheme(preferences);
    const locale = await getOSLocale();
    logInfo(` - System locale detected: ${locale}`);
    const language = getLanguage(preferences, locale);
    logInfo(` - Language updated: ${language}`);
    await changeLanguage(language);
    logInfo(
        ` - Auto clear clipboard: ${
            preferences.autoClearClipboard ? preferences.autoClearClipboard + "s" : "Off"
        }`
    );
    logInfo(
        ` - Lock vaults after: ${
            preferences.lockVaultsAfterTime ? preferences.lockVaultsAfterTime + "s" : "Off"
        }`
    );
    logInfo(` - Background start: ${preferences.startMode}`);
    logInfo(
        ` - Start with session launch: ${preferences.startWithSession ? "Enabled" : "Disabled"}`
    );
    await setStartWithSession(preferences.startWithSession);
    logInfo(` - File host: ${preferences.fileHostEnabled ? "Enabled" : "Disabled"}`);
    if (preferences.fileHostEnabled) {
        await startBrowserAPI();
        await startFileHost();
    } else {
        await stopBrowserAPI();
        await stopFileHost();
    }
}
