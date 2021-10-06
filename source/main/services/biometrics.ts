import { VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import { testSourceMasterPassword } from "./buttercup";
import { updateAppMenu } from "../actions/appMenu";
import { getBiometricProvider } from "./biometrics/BiometricProvider";

export async function disableSourceBiometricUnlock(sourceID: VaultSourceID): Promise<void> {
    return getBiometricProvider().disableSourceBiometricUnlock(sourceID);
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
    return getBiometricProvider().getSourcePasswordViaBiometrics(sourceID);
}

export async function sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
    return getBiometricProvider().sourceEnabledForBiometricUnlock(sourceID);
}

export async function supportsBiometricUnlock(): Promise<boolean> {
    return getBiometricProvider().supportsBiometricUnlock();
}

async function storePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    return getBiometricProvider().storePassword(sourceID, password);
}
