import { ipcRenderer } from "electron";

export function initialise() {
    ipcRenderer.send("update-vault-windows");
}
