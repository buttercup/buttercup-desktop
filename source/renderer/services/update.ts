import { ipcRenderer } from "electron";
import { UpdateInfo } from "electron-updater";
import { setCurrentUpdate, setShowUpdateDialog } from "../state/update";
import { showUpdateAvailable, showUpdateDownloaded } from "./notifications";
import { logInfo } from "../library/log";

export async function applyCurrentUpdateState(infoOverride?: UpdateInfo): Promise<void> {
    const updateInfo: UpdateInfo = infoOverride || await ipcRenderer.invoke("get-current-update");
    if (updateInfo) {
        setCurrentUpdate(updateInfo);
        showUpdateAvailable(
            updateInfo.version,
            () => {
                logInfo(`Opening update info: ${updateInfo.version}`);
                setShowUpdateDialog(true);
            },
            () => {
                logInfo("Update notification closed");
                setCurrentUpdate(null);
            }
        );
    }
}

export async function applyReadyUpdateState(infoOverride?: UpdateInfo) {
    const updateInfo: UpdateInfo = infoOverride || await ipcRenderer.invoke("get-ready-update");
    if (updateInfo) {
        setCurrentUpdate(updateInfo);
        showUpdateDownloaded(
            updateInfo.version,
            () => {
                logInfo(`Installing update: ${updateInfo.version}`);

            },
            () => {
                logInfo("Update complete notification closed");
            }
        );
    }
}

export async function muteCurrentUpdate(): Promise<void> {
    await ipcRenderer.invoke("mute-current-update");
}

export async function startCurrentUpdate(): Promise<void> {
    await ipcRenderer.invoke("start-current-update");
}
