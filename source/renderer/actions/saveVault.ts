import { ipcRenderer } from "electron";
import { Intent } from "@blueprintjs/core";
import { VaultFacade, VaultSourceID } from "buttercup";
import { setSaving } from "../state/app";
import { createProgressNotification } from "../services/notifications";
import { logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { ICON_UPLOAD } from "../../shared/symbols";

export async function saveVaultFacade(sourceID: VaultSourceID, vaultFacade: VaultFacade) {
    const progNotification = createProgressNotification(ICON_UPLOAD, 100);
    const savePromise = new Promise<void>((resolve, reject) => {
        ipcRenderer.once("save-vault-facade:reply", (evt, result) => {
            setSaving(false);
            const { ok, error } = JSON.parse(result) as {
                ok: boolean;
                error?: string;
            };
            if (!ok) {
                progNotification.clear(
                    `${t("notification.error.vault-save-failed")}: ${
                        error || t("notification.error.unknown-error")
                    }`,
                    Intent.DANGER,
                    10000
                );
                return reject(new Error(`Failed saving vault: ${error}`));
            }
            progNotification.clear(t("notification.vault-saved"), Intent.SUCCESS);
            resolve();
        });
    });
    setSaving(true);
    logInfo(`Saving vault facade: ${sourceID}`);
    ipcRenderer.send(
        "save-vault-facade",
        JSON.stringify({
            sourceID,
            vaultFacade
        })
    );
    await savePromise;
    logInfo(`Saved vault facade: ${sourceID}`);
}
