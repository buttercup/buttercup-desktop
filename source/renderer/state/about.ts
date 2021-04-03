import { State, createState } from "@hookstate/core";

export const SHOW_ABOUT: State<boolean> = createState(false as boolean);

export function showAbout(show = true) {
    SHOW_ABOUT.set(show);
}
