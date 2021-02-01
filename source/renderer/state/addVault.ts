import { State, createState } from "@hookstate/core";

export const SHOW_ADD_VAULT: State<boolean> = createState(false as boolean);

export function showAddVaultMenu(show = true) {
    SHOW_ADD_VAULT.set(show);
}
