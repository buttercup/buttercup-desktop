import { VaultSourceID } from "buttercup";
import { getPasswordEmitter } from "../services/password";
import { sourceHasBiometricAvailability } from "../services/biometrics";
import { PASSWORD_STATE } from "../state/password";

export async function getPrimaryPassword(sourceID?: VaultSourceID): Promise<string | null> {
    if (sourceID) {
        const supportsBiometrics = await sourceHasBiometricAvailability(sourceID);
        if (supportsBiometrics) {
            PASSWORD_STATE.passwordViaBiometricSource = sourceID;
        }
    }
    PASSWORD_STATE.showPrompt = true;
    const emitter = getPasswordEmitter();
    const password = await new Promise<string | null>((resolve) => {
        const callback = (password: string | null) => {
            resolve(password);
            emitter.removeListener("password", callback);
        };
        emitter.once("password", callback);
    });
    PASSWORD_STATE.passwordViaBiometricSource = null;
    return password;
}
