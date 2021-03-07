import { ipcRenderer } from "electron";
import { logInfo } from "../library/log";
import { attachUpdatedListener, getThemeType, updateBodyTheme } from "../library/theme";
import { initialise as initialiseI18n } from "../../shared/i18n/trans";
import { getPreferences } from "./preferences";
import { DEFAULT_LANGUAGE } from "../../shared/symbols";

export async function initialise() {
    const preferences = await getPreferences();
    const language = preferences.language || DEFAULT_LANGUAGE;
    logInfo(`Starting with language: ${language}`);
    await initialiseI18n(language);
    ipcRenderer.send("update-vault-windows");
    logInfo("Window opened and initialised");
    attachUpdatedListener();
    updateBodyTheme(getThemeType());
}
