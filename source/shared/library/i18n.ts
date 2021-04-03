import { DEFAULT_LANGUAGE } from "../symbols";
import { Preferences } from "../types";

export function getLanguage(preferences: Preferences, locale: string): string {
    return preferences.language || locale || DEFAULT_LANGUAGE;
}
