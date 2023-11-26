import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { getPrimaryPassword } from "./password";
import { setBusy } from "../state/app";
import { showError } from "../services/notifications";
import { logInfo } from "../library/log";
import { getVaultSettings, saveVaultSettings } from "../services/vaultSettings";
import { t } from "../../shared/i18n/trans";

export async function unlockVaultSource(sourceID: VaultSourceID): Promise<boolean> {
    const [password, biometricsEnabled, usedBiometrics] = await getPrimaryPassword(sourceID);
    if (!password) return false;
    setBusy(true);
    logInfo(`Unlocking source: ${sourceID}`);
    try {
        await ipcRenderer.invoke("unlock-source", sourceID, password);
    } catch (err) {
        showError(
            `${t("notification.error.vault-unlock-failed")}: ${
                err?.message ?? t("notification.error.unknown-error")
            }`
        );
        setBusy(false);
        return await unlockVaultSource(sourceID);
    }
    setBusy(false);
    // Update config
    if (biometricsEnabled) {
        const vaultSettings = await getVaultSettings(sourceID);
        const { biometricForcePasswordMaxInterval, biometricForcePasswordCount } = vaultSettings;
        const maxPasswordCount = parseInt(biometricForcePasswordCount, 10);
        const maxInterval = parseInt(biometricForcePasswordMaxInterval, 10);
        if (!isNaN(maxPasswordCount) && maxPasswordCount > 0 && usedBiometrics) {
            // Max password count enabled, increment count
            vaultSettings.biometricUnlockCount += 1;
            logInfo(`biometric unlock count increased: ${vaultSettings.biometricUnlockCount}`);
        } else {
            // Not enabled, ensure 0
            vaultSettings.biometricUnlockCount = 0;
        }
        if (!isNaN(maxInterval) && maxInterval > 0 && usedBiometrics) {
            // Interval enabled, set to now
            if (
                typeof vaultSettings.biometricLastManualUnlock === "number" &&
                vaultSettings.biometricLastManualUnlock > 0
            ) {
                logInfo(
                    `biometric unlock date ignored as already set: ${vaultSettings.biometricLastManualUnlock}`
                );
            } else {
                vaultSettings.biometricLastManualUnlock = Date.now();
                logInfo(`biometric unlock date set: ${vaultSettings.biometricLastManualUnlock}`);
            }
        } else if (
            typeof vaultSettings.biometricLastManualUnlock === "number" &&
            vaultSettings.biometricLastManualUnlock > 0
        ) {
            // Exceeded: new date
            vaultSettings.biometricLastManualUnlock = Date.now();
            logInfo(`biometric unlock date reset: ${vaultSettings.biometricLastManualUnlock}`);
        } else {
            // Not enabled: back to null
            vaultSettings.biometricLastManualUnlock = null;
        }
        await saveVaultSettings(sourceID, vaultSettings);
    }
    // Return result
    logInfo(`Unlocked source: ${sourceID}`);
    return true;
}
