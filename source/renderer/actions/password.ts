import { VaultSourceID } from "buttercup";
import { getPasswordEmitter } from "../services/password";
import { sourceHasBiometricAvailability } from "../services/biometrics";
import { setBiometricSourceID, showPasswordPrompt } from "../state/password";

export async function getPrimaryPassword(sourceID?: VaultSourceID): Promise<string | null> {
    if (sourceID) {
        const supportsBiometrics = await sourceHasBiometricAvailability(sourceID);
        if (supportsBiometrics) {
            setBiometricSourceID(sourceID);
        }
    }
    showPasswordPrompt(true);
    const emitter = getPasswordEmitter();
    const password = await new Promise<string | null>((resolve) => {
        const callback = (password: string | null) => {
            resolve(password);
            emitter.removeListener("password", callback);
        };
        emitter.once("password", callback);
    });
    setBiometricSourceID(null);
    return password;
}
