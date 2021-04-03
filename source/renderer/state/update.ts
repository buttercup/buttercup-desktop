import { State, createState } from "@hookstate/core";
import { UpdateInfo } from "electron-updater";

export const CURRENT_UPDATE: State<UpdateInfo> = createState(null as UpdateInfo);
export const SHOW_UPDATE_DIALOG: State<boolean> = createState(false as boolean);

export function setCurrentUpdate(update: UpdateInfo) {
    CURRENT_UPDATE.set(update);
}

export function setShowUpdateDialog(show: boolean) {
    SHOW_UPDATE_DIALOG.set(show);
}
