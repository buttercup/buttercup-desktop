import { ipcRenderer } from "electron";
import { VaultFacade, VaultSourceID } from "buttercup";
import { setSaving } from "../state/app";
import { createProgressNotification } from "../services/notifications";
import { ICON_UPLOAD } from "../../shared/symbols";
import { Intent } from "@blueprintjs/core";

export async function saveVaultFacade(sourceID: VaultSourceID, vaultFacade: VaultFacade) {
    const progNotification = createProgressNotification(ICON_UPLOAD, 100);
    const savePromise = new Promise<void>((resolve, reject) => {
        ipcRenderer.once("save-vault-facade:reply", (evt, result) => {
            setSaving(false);
            const { ok, error } = JSON.parse(result) as {
                ok: boolean,
                error?: string
            };
            if (!ok) {
                progNotification.clear(`Vault failed to save: ${error || "Unknown error"}`, Intent.DANGER, 10000);
                return reject(new Error(`Failed saving vault: ${error}`));
            }
            progNotification.clear("Vault saved", Intent.SUCCESS);
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
