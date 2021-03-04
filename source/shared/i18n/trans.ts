import i18next, { TOptions } from "i18next";
import translations from "./translations/index";

export async function initialise() {
    await i18next.init({
        lng: "en",
        fallbackLng: "en",
        debug: false,
        resources: Object.keys(translations).reduce((output, lang) => ({
            ...output,
            [lang]: {
                translation: translations[lang]
            }
        }), {})
    });
}

export function t(key: string, options?: TOptions) {
    return i18next.t(key, options);
}
