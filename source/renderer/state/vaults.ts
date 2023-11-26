import { VaultSourceID } from "buttercup";
import { createStateObject } from "obstate";
import { VaultSourceDescription } from "../types";

export const VAULTS_STATE = createStateObject<{
    currentVault: VaultSourceID | null;
    currentVaultAttachments: boolean;
    vaultsList: Array<VaultSourceDescription>;
}>({
    currentVault: null,
    currentVaultAttachments: false,
    vaultsList: []
});
