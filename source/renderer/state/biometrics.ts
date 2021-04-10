import { State, createState } from "@hookstate/core";

export const SHOW_REGISTER_PROMPT: State<boolean> = createState(false as boolean);

export function showRegistrationPrompt(show = true) {
    SHOW_REGISTER_PROMPT.set(show);
}
