import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { setVaultsWithBiometrics } from "../state/biometrics";
import { VaultSourceDescription } from "../types";

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

export async function updateVaultsBiometricsStates(
    sources: Array<VaultSourceDescription>
): Promise<void> {
    const results: Array<VaultSourceID> = [];
    await Promise.all(
        sources.map(async (source) => {
            const hasBio = await sourceHasBiometricAvailability(source.id);
            if (hasBio) {
                results.push(source.id);
            }
        })
    );
    setVaultsWithBiometrics(results);
}
