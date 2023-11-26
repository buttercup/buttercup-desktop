import { VaultSourceID } from "buttercup";
import { createStateObject } from "obstate";

export const PASSWORD_STATE = createStateObject<{
    passwordViaBiometricSource: VaultSourceID | null;
    showPrompt: boolean;
}>({
    passwordViaBiometricSource: null,
    showPrompt: false
});
