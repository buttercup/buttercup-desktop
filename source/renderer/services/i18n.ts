import { ipcRenderer } from "electron";
import LANGUAGES from "../../shared/i18n/translations/index";
import { Language } from "../types";

export async function getAvailableLanguages(): Promise<Array<Language>> {
    return Object.keys(LANGUAGES).reduce(
        (output, slug) => [
            ...output,
            {
                name: LANGUAGES[slug]._ || `Unknown (${slug})`,
                slug
            }
        ],
        []
    );
}

export async function getOSLocale(): Promise<string> {
    const locale = await ipcRenderer.invoke("get-locale");
    return locale;
}
