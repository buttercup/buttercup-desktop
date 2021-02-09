import { VaultFacade, VaultSourceID } from "buttercup";
import { BrowserWindow, ipcMain } from "electron";
import { addVaultFromPayload, showAddFileVaultDialog } from "./actions/connect";
import { unlockSourceWithID } from "./actions/unlock";
import { saveVaultFacade, sendSourcesToWindows } from "./services/buttercup";
import { getVaultFacade } from "./services/facades";
import { AddVaultPayload } from "./types";

ipcMain.on("add-vault-config", async (evt, payload) => {
    const addVaultPayload: AddVaultPayload = JSON.parse(payload);
    try {
        await addVaultFromPayload(addVaultPayload);
        evt.reply("add-vault-config:reply", JSON.stringify({
            ok: true,
        }));
    } catch (err) {
        console.error(err);
        evt.reply("add-vault-config:reply", JSON.stringify({
            ok: false,
            error: err.message
        }));
    }
});

ipcMain.on("get-add-vault-filename", async evt => {
    const win = BrowserWindow.fromWebContents(evt.sender);
    if (!win) {
        // @todo record error
    }
    const filename = await showAddFileVaultDialog(win as BrowserWindow);
    evt.reply("get-add-vault-filename:reply", JSON.stringify(filename));
});

ipcMain.on("get-vault-facade", async (evt, sourceID) => {
    const win = BrowserWindow.fromWebContents(evt.sender);
    if (!win) {
        // @todo record error
    }
    const facade = await getVaultFacade(sourceID);
    evt.reply("get-vault-facade:reply", JSON.stringify(facade));
});

ipcMain.on("save-vault-facade", async (evt, payload) => {
    const { sourceID, vaultFacade } = JSON.parse(payload) as {
        sourceID: VaultSourceID,
        vaultFacade: VaultFacade
    };
    await saveVaultFacade(sourceID, vaultFacade);
    evt.reply("save-vault-facade:reply", JSON.stringify({
        ok: true
    }));
});

ipcMain.on("unlock-source", async (evt, payload) => {
    const {
        sourceID,
        password
    } = JSON.parse(payload);
    await unlockSourceWithID(sourceID, password);
});

ipcMain.on("update-vault-windows", () => {
    sendSourcesToWindows();
});
