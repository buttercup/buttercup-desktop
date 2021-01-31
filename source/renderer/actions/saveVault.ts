import { ipcRenderer } from "electron";
import { VaultFacade, VaultSourceID } from "buttercup";

export async function saveVaultFacade(sourceID: VaultSourceID, vaultFacade: VaultFacade) {
    const savePromise = new Promise<void>((resolve, reject) => {
        ipcRenderer.once("save-vault-facade:reply", (evt, result) => {
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
    ipcRenderer.send("save-vault-facade", JSON.stringify({
        sourceID,
        vaultFacade
    }));
    await savePromise;
}
