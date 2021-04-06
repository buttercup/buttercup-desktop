import { State, createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";
import { VaultSourceDescription } from "../types";

export const CURRENT_VAULT: State<VaultSourceID | null> = createState(null as VaultSourceID | null);
export const VAULTS_LIST: State<Array<VaultSourceDescription>> = createState(
    [] as Array<VaultSourceDescription>
);

export function getCurrentSourceID(): VaultSourceID | null {
    return CURRENT_VAULT.get();
}

export function setCurrentVault(sourceID: VaultSourceID) {
    CURRENT_VAULT.set(sourceID);
}

export function setVaultsList(vaults: Array<VaultSourceDescription>) {
    VAULTS_LIST.set([...vaults]);
}
