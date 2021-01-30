import { State, createState } from "@hookstate/core";

export const SHOW_PROMPT: State<boolean> = createState(false as boolean);

export function showPasswordPrompt(show = true) {
    console.log("SHOW PROMPT", show);
    SHOW_PROMPT.set(show);
    console.log("GET", SHOW_PROMPT.get());
}
