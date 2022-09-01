import { State, createState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";

export const SHOW_VAULT_SETTINGS: State<VaultSourceID> = createState("");

export function showVaultSettingsForSource(sourceID: VaultSourceID) {
    SHOW_VAULT_SETTINGS.set(sourceID);
}
