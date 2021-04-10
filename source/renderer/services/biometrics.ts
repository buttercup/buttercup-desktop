import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";

export async function registerBiometricUnlock(
    sourceID: VaultSourceID,
    password: string
): Promise<void> {
    await ipcRenderer.invoke("register-biometric-unlock", sourceID, password);
}
