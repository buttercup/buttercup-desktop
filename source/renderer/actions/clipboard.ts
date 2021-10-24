import { ipcRenderer } from "electron";

export async function copyText(text: string) {
    await ipcRenderer.invoke("write-clipboard", text);
}

export function userCopiedText(text: string) {
    ipcRenderer.invoke("copied-into-clipboard", text);
}
