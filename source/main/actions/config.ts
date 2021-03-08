import { logInfo } from "../library/log";
import { applyCurrentTheme } from "../services/theme";
import { getOSLocale } from "../services/locale";
import { changeLanguage } from "../../shared/i18n/trans";
import { getLanguage } from "../../shared/library/i18n";
import { Preferences } from "../types";

export async function handleConfigUpdate(preferences: Preferences) {
    logInfo("Config updated");
    applyCurrentTheme(preferences);
    const locale = await getOSLocale();
    logInfo(` - System locale detected: ${locale}`);
    const language = getLanguage(preferences, locale);
    logInfo(` - Language updated: ${language}`);
    await changeLanguage(language);
}
