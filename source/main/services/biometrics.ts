import { VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import { testSourceMasterPassword } from "./buttercup";
import { updateAppMenu } from "../actions/appMenu";
import BiometricProvider from "./biometrics/BiometricProvider";

export async function disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
    return BiometricProvider.getInstance().disableSourceBiometricUnlock(sourceID);
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
    return BiometricProvider.getInstance().getSourcePasswordViaBiometrics(sourceID);
}

export async function sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
    return BiometricProvider.getInstance().sourceEnabledForBiometricUnlock(sourceID);
}

export async function supportsBiometricUnlock(): Promise<boolean> {
    return BiometricProvider.getInstance().supportsBiometricUnlock();
}

async function storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    return BiometricProvider.getInstance().storePassword(sourceID, password);
}
