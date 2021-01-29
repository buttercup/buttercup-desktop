import { State, createState } from "@hookstate/core";

export const SHOW_PROMPT: State<boolean> = createState(false as boolean);

export function showPasswordPrompt(show = true) {
    SHOW_PROMPT.set(show);
}
