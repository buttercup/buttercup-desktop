import { ipcRenderer } from "electron";
import { UpdateInfo } from "electron-updater";
import { Intent } from "@blueprintjs/core";
import { setCurrentUpdate, setShowUpdateDialog } from "../state/update";
import {
    ProgressNotification,
    createProgressNotification,
    showUpdateAvailable,
    showUpdateDownloaded
} from "./notifications";
import { logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { UpdateProgressInfo } from "../types";

let __updateProgress: ProgressNotification = null;

export async function applyCurrentUpdateState(infoOverride?: UpdateInfo): Promise<void> {
    const updateInfo: UpdateInfo = infoOverride || (await ipcRenderer.invoke("get-current-update"));
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
    const updateInfo: UpdateInfo = infoOverride || (await ipcRenderer.invoke("get-ready-update"));
    if (updateInfo) {
        setCurrentUpdate(updateInfo);
        showUpdateDownloaded(
            updateInfo.version,
            () => {
                logInfo(`Installing update: ${updateInfo.version}`);
                ipcRenderer.invoke("install-update");
            },
            () => {
                logInfo("Update complete notification closed");
            }
        );
    }
}

export function applyUpdateProgress(progress: UpdateProgressInfo) {
    if (progress === null) {
        if (__updateProgress) {
            __updateProgress.clear(t("update.downloaded"), Intent.SUCCESS);
        }
        __updateProgress = null;
        return;
    }
    if (__updateProgress) {
        __updateProgress.setProgress(progress.percent);
    } else {
        __updateProgress = createProgressNotification("cloud-download", progress.percent);
    }
}

export async function muteCurrentUpdate(): Promise<void> {
    await ipcRenderer.invoke("mute-current-update");
}

export async function startCurrentUpdate(): Promise<void> {
    await ipcRenderer.invoke("start-current-update");
}
