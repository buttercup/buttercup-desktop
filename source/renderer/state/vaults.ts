import { State, createState } from "@hookstate/core";
import { VaultSourceDescription } from "../../shared/types";

export const VAULTS_LIST: State<Array<VaultSourceDescription>> = createState([] as Array<VaultSourceDescription>);

export function setVaultsList(vaults: Array<VaultSourceDescription>) {
    VAULTS_LIST.set([...vaults]);
}
