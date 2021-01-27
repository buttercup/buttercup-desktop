import { BrowserWindow } from "electron";
import { VaultSourceID } from "buttercup";

export function notifyWindowsOfSourceUpdate(sourceID: VaultSourceID) {
    BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send("source-updated", sourceID);
    });
}
