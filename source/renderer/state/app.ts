import { State, createState } from "@hookstate/core";

export const BUSY: State<boolean> = createState(false as boolean);
export const SAVING: State<boolean> = createState(false as boolean);

export function setBusy(isBusy: boolean) {
    BUSY.set(isBusy);
}

export function setSaving(isSaving: boolean) {
    SAVING.set(isSaving);
}
