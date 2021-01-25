import { ipcRenderer } from "electron";

export function startAddFileVault() {
    ipcRenderer.send("add-file-vault");
}
