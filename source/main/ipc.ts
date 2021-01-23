import { BrowserWindow, ipcMain } from "electron";
import { runAddFileVault } from "./actions/connect";

ipcMain.on("add-file-vault", evt => {
    const win = BrowserWindow.fromWebContents(evt.sender);
    if (!win) {
        // @todo record error
    }
    runAddFileVault(win as BrowserWindow);
});
