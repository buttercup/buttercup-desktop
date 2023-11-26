import { VaultSourceID } from "buttercup";
import { getPasswordEmitter } from "../services/password";
import { sourceHasBiometricAvailability } from "../services/biometrics";
import { PASSWORD_STATE } from "../state/password";

export async function getPrimaryPassword(
    sourceID?: VaultSourceID
): Promise<[password: string | null, biometricsEnabled: boolean, usedBiometrics: boolean]> {
    let biometricsEnabled: boolean = false;
    if (sourceID) {
        const supportsBiometrics = await sourceHasBiometricAvailability(sourceID);
        if (supportsBiometrics) {
            PASSWORD_STATE.passwordViaBiometricSource = sourceID;
            biometricsEnabled = true;
        }
    }
    PASSWORD_STATE.showPrompt = true;
    const emitter = getPasswordEmitter();
    const [password, usedBiometrics] = await new Promise<[string | null, boolean]>((resolve) => {
        const callback = (password: string | null, usedBiometrics: boolean) => {
            resolve([password, usedBiometrics]);
            emitter.removeListener("password", callback);
        };
        emitter.once("password", callback);
    });
    PASSWORD_STATE.passwordViaBiometricSource = null;
    return [password, biometricsEnabled, usedBiometrics];
}
