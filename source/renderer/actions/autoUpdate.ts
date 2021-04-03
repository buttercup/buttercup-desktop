import { ipcRenderer } from "electron";

export async function toggleAutoUpdate(enabled: boolean): Promise<void> {
    await ipcRenderer.invoke("toggle-auto-update", enabled);
}
