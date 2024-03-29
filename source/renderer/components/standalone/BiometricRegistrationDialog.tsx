import React, { useCallback, useState } from "react";
import { useState as useHookState } from "@hookstate/core";
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { Layerr } from "layerr";
import { useSingleState } from "react-obstate";
import { SHOW_REGISTER_PROMPT } from "../../state/biometrics";
import { VAULTS_STATE } from "../../state/vaults";
import { registerBiometricUnlock } from "../../services/biometrics";
import { showError, showSuccess } from "../../services/notifications";
import { t } from "../../../shared/i18n/trans";

export function BiometricRegistrationDialog() {
    const showPromptState = useHookState(SHOW_REGISTER_PROMPT);
    const [currentVault] = useSingleState(VAULTS_STATE, "currentVault");
    const [password, setPassword] = useState("");
    const [prompting, setPrompting] = useState(false);
    const close = useCallback(() => {
        setPassword("");
        showPromptState.set(false);
        setPrompting(false);
    }, []);
    const submitPassword = useCallback(() => {
        if (!currentVault) return;
        setPrompting(true);
        registerBiometricUnlock(currentVault, password)
            .then(() => {
                close();
                showSuccess(t("dialog.biometric-reg.success"));
            })
            .catch(err => {
                const info = Layerr.info(err);
                showError(info?.i18n && t(info.i18n) || err.message);
                setPrompting(false);
            });
    }, [close, currentVault, password]);
    const handleKeyPress = useCallback(event => {
        if (event.key === "Enter") {
            submitPassword();
        }
    }, [submitPassword]);
    return (
        <Dialog isOpen={showPromptState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("dialog.biometric-reg.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup
                    label={t("dialog.biometric-reg.label")}
                    labelFor="password"
                    labelInfo={t("input-required")}
                >
                    <InputGroup
                        disabled={prompting}
                        id="password"
                        placeholder={t("dialog.biometric-reg.placeholder")}
                        type="password"
                        value={password}
                        onChange={evt => setPassword(evt.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />
                </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={prompting}
                        intent={Intent.PRIMARY}
                        onClick={() => submitPassword()}
                        title={t("dialog.biometric-reg.button-reg-title")}
                    >
                        {t("dialog.biometric-reg.button-reg")}
                    </Button>
                    <Button
                        onClick={close}
                        title={t("dialog.biometric-reg.button-cancel-title")}
                    >
                        {t("dialog.biometric-reg.button-cancel")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
