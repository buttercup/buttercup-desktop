import { ipcRenderer } from "electron";
import { init } from "buttercup";
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
import { initialisePresence } from "./presence";
import { changeLanguage as changeUiLangage } from "@buttercup/ui";

let __lastInit: Promise<void> | null = null;

export async function initialise(rootElement: HTMLElement) {
    if (__lastInit) return __lastInit;
    __lastInit = initialiseInternal(rootElement);
    return __lastInit;
}

async function initialiseInternal(rootElement: HTMLElement) {
    logInfo("Initialising Buttercup core");
    init();
    const preferences = await getPreferences();
    const locale = await getOSLocale();
    const language = getLanguage(preferences, locale);
    logInfo(`Starting with language: ${language}`);
    await initialiseI18n(language);
    await changeUiLangage(language);
    onLanguageChanged((newLang) => {
        logInfo(`Language updated: ${newLang}`);
        changeLanguage(newLang);
        changeUiLangage(language);
    });
    ipcRenderer.send("update-vault-windows");
    logInfo("Window opened and initialised");
    attachUpdatedListener();
    updateBodyTheme(getThemeType());
    await applyCurrentUpdateState();
    await applyReadyUpdateState();
    initialisePresence(rootElement);
}
