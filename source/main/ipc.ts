import { BrowserWindow, ipcMain } from "electron";
import { addVaultFromPayload, showAddFileVaultDialog } from "./actions/connect";
import { sendSourcesToWindows } from "./services/buttercup";
import { AddVaultPayload } from "./types";

ipcMain.on("add-existing-vault", async (evt, payload) => {
    const addVaultPayload: AddVaultPayload = JSON.parse(payload);
    await addVaultFromPayload(addVaultPayload);
});

ipcMain.on("get-add-vault-filename", async evt => {
    const win = BrowserWindow.fromWebContents(evt.sender);
    if (!win) {
        // @todo record error
    }
    const filename = await showAddFileVaultDialog(win as BrowserWindow);
    evt.reply("get-add-vault-filename:reply", JSON.stringify(filename));
});

ipcMain.on("update-vault-windows", () => {
    sendSourcesToWindows();
});
