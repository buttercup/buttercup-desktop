import { State, createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";

export const PASSWORD_VIA_BIOMETRIC_SOURCE: State<VaultSourceID> = createState(
    null as VaultSourceID
);
export const SHOW_PROMPT: State<boolean> = createState(false as boolean);

export function setBiometricSourceID(sourceID: VaultSourceID) {
    PASSWORD_VIA_BIOMETRIC_SOURCE.set(sourceID);
}

export function showPasswordPrompt(show = true) {
    SHOW_PROMPT.set(show);
    if (!show) {
        PASSWORD_VIA_BIOMETRIC_SOURCE.set(null);
    }
}
