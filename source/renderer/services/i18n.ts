import { Language } from "../types";

export async function getAvailableLanguages(): Promise<Array<Language>> {
    return [{
        name: "English (UK)",
        slug: "en-gb"
    }];
}
