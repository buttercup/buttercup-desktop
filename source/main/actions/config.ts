import { logInfo } from "../library/log";
import { applyCurrentTheme } from "../services/theme";
import { changeLanguage } from "../../shared/i18n/trans";
import { DEFAULT_LANGUAGE } from "../../shared/symbols";
import { Preferences } from "../types";

export async function handleConfigUpdate(preferences: Preferences) {
    applyCurrentTheme(preferences);
    const language = preferences.language || DEFAULT_LANGUAGE;
    logInfo(`Language updated: ${language}`);
    await changeLanguage(language);
}
