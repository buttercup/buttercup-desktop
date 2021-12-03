import { systemPreferences } from "electron";
import { VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import keytar from "keytar";
import { getSourceDescription, testSourceMasterPassword } from "./buttercup";
import { APP_ID } from "../../shared/symbols";
import { updateAppMenu } from "../actions/appMenu";
import { logInfo, logWarn } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { isOSX } from "../../shared/library/platform";

export async function disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
    logInfo(`Removing keychain source password (${sourceID}) for app: ${APP_ID}`);
    const deleted = await keytar.deletePassword(APP_ID, sourceID);
    if (!deleted) {
        logWarn(
            `System reported that it did not successfully delete biometric registration for source: ${sourceID}`
        );
    }
    await updateAppMenu();
}

export async function enableSourceBiometricUnlock(
    sourceID: VaultSourceID,
    password: string
): Promise<void> {
    const passwordMatches = await testSourceMasterPassword(sourceID, password);
    if (!passwordMatches) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.biometric-invalid-password"
                }
            },
            `Failed storing source biometric details: Invalid password provided for source: ${sourceID}`
        );
    }
    await storePassword(sourceID, password);
    await updateAppMenu();
}

export async function getSourcePasswordViaBiometrics(sourceID: VaultSourceID): Promise<string> {
    const { name } = getSourceDescription(sourceID);
    try {
        await systemPreferences.promptTouchID(t("biometrics.prompt.unlock-vault", { name }));
        return keytar.getPassword(APP_ID, sourceID);
    } catch (err) {
        if (/Canceled by user/i.test(err.message)) {
            logInfo(`Touch unlock cancelled by user for source: ${sourceID}`);
            return null;
        }
        logWarn("Touch ID failed", err);
        throw new Layerr(
            {
                cause: err,
                info: {
                    i18n: "error.biometric-unlock-failed"
                }
            },
            `Validating biometric details failed for unlocking source: ${sourceID}`
        );
    }
}

export async function sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
    try {
        const password = await keytar.getPassword(APP_ID, sourceID);
        return !!password;
    } catch (e) {
        logWarn("keytar.getPassword failed", e);
    }
    return false;
}

export async function supportsBiometricUnlock(): Promise<boolean> {
    if (!isOSX()) return false;
    return systemPreferences.canPromptTouchID();
}

async function storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    const { name } = getSourceDescription(sourceID);
    try {
        await systemPreferences.promptTouchID(t("biometrics.prompt.store", { name }));
    } catch (err) {
        logWarn("Touch ID failed", err);
        throw new Layerr(
            {
                cause: err,
                info: {
                    i18n: "error.biometric-store-failed"
                }
            },
            `Storing biometric details failed for source: ${sourceID}`
        );
    }
    logInfo(`Setting keychain source password (${sourceID}) for app: ${APP_ID}`);
    await keytar.setPassword(APP_ID, sourceID, password);
}
