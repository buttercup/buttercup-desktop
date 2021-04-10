import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";

export async function getBiometricSourcePassword(sourceID: VaultSourceID): Promise<string> {
    return ipcRenderer.invoke("get-biometric-source-password", sourceID);
}

export async function registerBiometricUnlock(
    sourceID: VaultSourceID,
    password: string
): Promise<void> {
    await ipcRenderer.invoke("register-biometric-unlock", sourceID, password);
}

export async function sourceHasBiometricAvailability(sourceID: VaultSourceID): Promise<boolean> {
    return ipcRenderer.invoke("check-source-biometrics", sourceID);
}
