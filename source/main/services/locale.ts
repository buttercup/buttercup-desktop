import osLocale from "os-locale";

export async function getOSLocale(): Promise<string> {
    const locale = await osLocale();
    return locale;
}
