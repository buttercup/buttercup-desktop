import { ipcRenderer } from "electron";
import { Intent } from "@blueprintjs/core";
import { VaultFacade, VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import { setSaving } from "../state/app";
import { createProgressNotification } from "../services/notifications";
import { logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { ICON_UPLOAD } from "../../shared/symbols";

export async function saveVaultFacade(sourceID: VaultSourceID, vaultFacade: VaultFacade) {
    const progNotification = createProgressNotification(ICON_UPLOAD, 100);
    setSaving(true);
    logInfo(`Saving vault facade: ${sourceID}`);
    try {
        await ipcRenderer.invoke("save-vault-facade", sourceID, vaultFacade);
        logInfo(`Saved vault facade: ${sourceID}`);
        progNotification.clear(t("notification.vault-saved"), Intent.SUCCESS);
    } catch (err) {
        progNotification.clear(
            `${t("notification.error.vault-save-failed")}: ${
                err.message || t("notification.error.unknown-error")
            }`,
            Intent.DANGER,
            10000
        );
        throw new Layerr(err, "Failed saving vault");
    } finally {
        setSaving(false);
    }
}
