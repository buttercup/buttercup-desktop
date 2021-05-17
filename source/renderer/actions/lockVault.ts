import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { setBusy } from "../state/app";
import { showError } from "../services/notifications";
import { logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";

export async function lockVaultSource(sourceID: VaultSourceID) {
    setBusy(true);
    logInfo(`Locking source: ${sourceID}`);
    const lockPromise = new Promise<void>((resolve, reject) => {
        ipcRenderer.once("lock-source:reply", (evt, result) => {
            setBusy(false);
            const { ok, error } = JSON.parse(result) as {
                ok: boolean;
                error?: string;
            };
            if (!ok) {
                showError(
                    `${t("notification.error.vault-lock-failed")}: ${
                        error || t("notification.error.unknown-error")
                    }`
                );
                return reject(new Error(`Failed locking vault: ${error}`));
            }
            resolve();
        });
    });
    ipcRenderer.send(
        "lock-source",
        JSON.stringify({
            sourceID
        })
    );
    await lockPromise;
    logInfo(`Locked source: ${sourceID}`);
}
