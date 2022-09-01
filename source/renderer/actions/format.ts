import { ipcRenderer } from "electron";
import { VaultFormatID, VaultSourceID } from "buttercup";
import { setBusy } from "../state/app";
import { showError, showWarning } from "../services/notifications";
import { t } from "../../shared/i18n/trans";
import { logErr, logInfo, logWarn } from "../library/log";

export async function convertVaultToFormat(
    sourceID: VaultSourceID,
    format: VaultFormatID
): Promise<void> {
    setBusy(true);
    try {
        const converted = await ipcRenderer.invoke("convert-vault-format", sourceID, format);
        if (!converted) {
            logWarn(`Unable to convert vault forrmat: ${sourceID} (${format})`);
            showWarning(t("vault-format-upgrade-failed"));
            return;
        }
    } catch (err) {
        showError(
            `${t("vault-format-upgrade-failed")}: ${
                err?.message ?? t("notification.error.unknown-error")
            }`
        );
        logErr("Failed converting vault format:", err);
        return;
    } finally {
        setBusy(false);
    }
    logInfo(`Converted vault format: ${sourceID} (${format})`);
}
