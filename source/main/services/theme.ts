import { nativeTheme } from "electron";
import { getConfigValue } from "./config";
import { logInfo } from "../library/log";
import { Preferences } from "../types";

export async function applyCurrentTheme(preferences?: Preferences) {
    const prefs: Preferences = preferences ? preferences : await getConfigValue("preferences");
    logInfo(`Applying theme source: ${prefs.uiTheme}`);
    nativeTheme.themeSource = prefs.uiTheme;
}
