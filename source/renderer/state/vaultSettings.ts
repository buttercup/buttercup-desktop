import { State, createState } from "@hookstate/core";

export const SHOW_SETTINGS: State<boolean> = createState(false as boolean);

export function showVaultSettings(show = true) {
    SHOW_SETTINGS.set(show);
}
