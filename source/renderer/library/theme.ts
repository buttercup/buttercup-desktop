import { remote } from "electron";
import { logInfo } from "./log";
import { Theme } from "../types";

const { nativeTheme } = remote;

let __listening = false;

export function attachUpdatedListener() {
    if (__listening) return;
    __listening = true;
    nativeTheme.on("updated", () => {
        const theme = getThemeType();
        logInfo(`Theme source updated: ${nativeTheme.themeSource}`);
        updateBodyTheme(theme);
    });
}

export function getThemeType(): Theme {
    return nativeTheme.shouldUseDarkColors ? Theme.Dark : Theme.Light;
}

export function updateBodyTheme(theme: Theme) {
    logInfo(`Setting body theme: ${theme}`);
    if (theme === Theme.Dark) {
        window.document.body.classList.add("bp3-dark");
    } else {
        window.document.body.classList.remove("bp3-dark");
    }
}
