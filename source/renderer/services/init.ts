import { ipcRenderer } from "electron";
import { logInfo } from "../library/log";
import { attachUpdatedListener, getThemeType, updateBodyTheme } from "../library/theme";
import {
    changeLanguage,
    initialise as initialiseI18n,
    onLanguageChanged
} from "../../shared/i18n/trans";
import { getLanguage } from "../../shared/library/i18n";
import { getOSLocale } from "./i18n";
import { getPreferences } from "./preferences";
import { applyCurrentUpdateState, applyReadyUpdateState } from "./update";

let __lastInit: Promise<void> = null;

export async function initialise() {
    if (__lastInit) return __lastInit;
    __lastInit = initialiseInternal();
    return __lastInit;
}

async function initialiseInternal() {
    const preferences = await getPreferences();
    const locale = await getOSLocale();
    const language = getLanguage(preferences, locale);
    logInfo(`Starting with language: ${language}`);
    await initialiseI18n(language);
    onLanguageChanged((newLang) => {
        logInfo(`Language updated: ${newLang}`);
        changeLanguage(newLang);
    });
    ipcRenderer.send("update-vault-windows");
    logInfo("Window opened and initialised");
    attachUpdatedListener();
    updateBodyTheme(getThemeType());
    await applyCurrentUpdateState();
    await applyReadyUpdateState();
}
