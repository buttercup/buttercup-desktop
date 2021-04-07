import { systemPreferences } from "electron";
import { VaultSourceID } from "buttercup";

export async function sourceEnabledForBiometricUnlock(sourceID: VaultSourceID): Promise<boolean> {
    // @todo
    return false;
}

export async function supportsBiometricUnlock(): Promise<boolean> {
    return systemPreferences.canPromptTouchID();
}
