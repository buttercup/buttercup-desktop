import { State, createState } from "@hookstate/core";

export const SAVING: State<boolean> = createState(false as boolean);

export function setSaving(isSaving: boolean) {
    SAVING.set(isSaving);
}
