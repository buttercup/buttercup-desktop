import { ipcRenderer } from "electron";
import { VaultFacade, VaultSourceID } from "buttercup";
import { setSaving } from "../state/app";

export async function saveVaultFacade(sourceID: VaultSourceID, vaultFacade: VaultFacade) {
    const savePromise = new Promise<void>((resolve, reject) => {
        ipcRenderer.once("save-vault-facade:reply", (evt, result) => {
            setSaving(false);
            const { ok, error } = JSON.parse(result) as {
                ok: boolean,
                error?: string
            };
            if (!ok) {
                return reject(new Error(`Failed saving vault: ${error}`));
            }
            resolve();
        });
    });
    setSaving(true);
    ipcRenderer.send("save-vault-facade", JSON.stringify({
        sourceID,
        vaultFacade
    }));
    await savePromise;
}
