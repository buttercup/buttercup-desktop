import { ipcRenderer } from "electron";

export async function copyText(text: string) {
    await ipcRenderer.invoke("write-clipboard", text);
}
