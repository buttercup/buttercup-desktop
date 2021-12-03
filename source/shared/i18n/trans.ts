import i18next, { TOptions } from "i18next";
import translations from "./translations/index";
import { DEFAULT_LANGUAGE } from "../symbols";

export async function changeLanguage(lang: string) {
    await i18next.changeLanguage(lang);
}

export async function initialise(lang: string) {
    await i18next.init({
        lng: lang,
        fallbackLng: DEFAULT_LANGUAGE,
        debug: false,
        resources: Object.keys(translations).reduce(
            (output, lang) => ({
                ...output,
                [lang]: {
                    translation: translations[lang]
                }
            }),
            {}
        )
    });
}

export function onLanguageChanged(callback: (lang: string) => void): () => void {
    const cb = (lang: string) => callback(lang);
    i18next.on("languageChanged", cb);
    return () => {
        i18next.off("languageChanged", cb);
    };
}

export function t(key: string, options?: TOptions) {
    return i18next.t(key, options);
}
