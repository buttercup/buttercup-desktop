import { ipcRenderer } from "electron";
import { logInfo } from "../library/log";

export function initialise() {
    ipcRenderer.send("update-vault-windows");
    logInfo("Window opened and initialised");
}
