import { systemPreferences } from "electron";
import { VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import keytar from "keytar";
import { testSourceMasterPassword } from "./buttercup";
import { APP_ID } from "../../shared/symbols";
import { updateAppMenu } from "../actions/appMenu";
import { logInfo, logWarn } from "../library/log";

export async function disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
    logInfo(`Removing keychain source password (${sourceID}) for app: ${APP_ID}`);
    await keytar.deletePassword(APP_ID, sourceID);
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
                    i18n: "error.biometric-invalid-password",
                },
            },
            `Failed storing source biometric details: Invalid password provided for source: ${sourceID}`
        );
    }
    await storePassword(sourceID, password);
    await updateAppMenu();
}

export async function sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
    const password = await keytar.getPassword(APP_ID, sourceID);
    return !!password;
}

export async function supportsBiometricUnlock(): Promise<boolean> {
    return systemPreferences.canPromptTouchID();
}

async function storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    try {
        await systemPreferences.promptTouchID("Store vault credentials");
    } catch (err) {
        logWarn("Touch ID failed", err);
        throw new Layerr(
            {
                cause: err,
                info: {
                    i18n: "error.biometric-store-failed",
                },
            },
            `Storing biometric details failed for source: ${sourceID}`
        );
    }
    logInfo(`Setting keychain source password (${sourceID}) for app: ${APP_ID}`);
    await keytar.setPassword(APP_ID, sourceID, password);
}
