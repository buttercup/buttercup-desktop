import { systemPreferences } from "electron";

export async function supportsBiometricUnlock(): Promise<boolean> {
    return systemPreferences.canPromptTouchID();
}
