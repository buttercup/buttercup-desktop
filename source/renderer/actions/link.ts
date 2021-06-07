import { ipcRenderer } from "electron";

export function openLinkExternally(link: string) {
    ipcRenderer.invoke("open-link", link);
}
