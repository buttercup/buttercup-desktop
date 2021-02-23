import { State, createState } from "@hookstate/core";

export const SHOW_PREFERENCES: State<boolean> = createState(false as boolean);

export function showPreferences(show = true) {
    SHOW_PREFERENCES.set(show);
}
