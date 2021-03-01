import { ipcRenderer } from "electron";
import { logInfo } from "../library/log";
import { attachUpdatedListener, getThemeType, updateBodyTheme } from "../library/theme";

export function initialise() {
    ipcRenderer.send("update-vault-windows");
    logInfo("Window opened and initialised");
    attachUpdatedListener();
    updateBodyTheme(getThemeType());
}
