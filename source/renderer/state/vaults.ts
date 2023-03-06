import { State, createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";
import { VaultSourceDescription } from "../types";

export const CURRENT_VAULT: State<VaultSourceID | null> = createState(null as VaultSourceID | null);
export const CURRENT_VAULT_ATTACHMENTS: State<boolean> = createState(false as boolean);
export const VAULTS_LIST: State<Array<VaultSourceDescription>> = createState(
    [] as Array<VaultSourceDescription>
);

export function getCurrentSourceID(): VaultSourceID | null {
    return CURRENT_VAULT.get();
}

export function setCurrentVault(sourceID: VaultSourceID | null) {
    CURRENT_VAULT.set(sourceID);
}

export function setCurrentVaultSupportsAttachments(supports: boolean) {
    CURRENT_VAULT_ATTACHMENTS.set(supports);
}

export function setVaultsList(vaults: Array<VaultSourceDescription>) {
    VAULTS_LIST.set([...vaults]);
}
