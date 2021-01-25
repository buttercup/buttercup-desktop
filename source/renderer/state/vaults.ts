import { createState } from "@hookstate/core";
import { VaultSourceDescription } from "../../shared/types";

export const VAULTS_LIST = createState<Array<VaultSourceDescription>>([]);

export function setVaultsList(vaults: Array<VaultSourceDescription>) {
    VAULTS_LIST.set([...vaults]);
}
