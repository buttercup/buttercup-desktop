import { State, createState } from "@hookstate/core";

export const SHOW_ADD_VAULT: State<boolean> = createState(false as boolean);
export const SHOW_NEW_FILE_PROMPT: State<boolean> = createState(false as boolean);

export function showAddVaultMenu(show = true) {
    SHOW_ADD_VAULT.set(show);
}

export function showNewFilePrompt(show = true) {
    SHOW_NEW_FILE_PROMPT.set(show);
}
