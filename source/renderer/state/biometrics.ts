import { State, createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";

export const SHOW_REGISTER_PROMPT: State<boolean> = createState(false as boolean);
export const VAULTS_WITH_BIOMETRICS: State<Array<VaultSourceID>> = createState(
    [] as Array<VaultSourceID>
);

export function setVaultsWithBiometrics(sourceIDs: Array<VaultSourceID>) {
    VAULTS_WITH_BIOMETRICS.set(sourceIDs);
}

export function showRegistrationPrompt(show = true) {
    SHOW_REGISTER_PROMPT.set(show);
}
