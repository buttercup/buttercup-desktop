import { State, createState } from "@hookstate/core";
import { VaultFacade, VaultSourceID } from "buttercup";
import { VaultSourceDescription } from "../../shared/types";

export const CURRENT_FACADE: State<VaultFacade | null> = createState(null as VaultFacade | null);
export const CURRENT_VAULT: State<VaultSourceID | null> = createState(null as VaultSourceID | null);
export const VAULTS_LIST: State<Array<VaultSourceDescription>> = createState([] as Array<VaultSourceDescription>);

export function getCurrentSourceID(): VaultSourceID | null {
    return CURRENT_VAULT.get();
}

export function setCurrentFacade(sourceID: VaultSourceID, facade: VaultFacade) {
    CURRENT_FACADE.set(facade);
    CURRENT_VAULT.set(sourceID);
}

export function setVaultsList(vaults: Array<VaultSourceDescription>) {
    VAULTS_LIST.set([...vaults]);
}
