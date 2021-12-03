import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useState as useHookState } from "@hookstate/core";
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent, NonIdealState } from "@blueprintjs/core";
import { Layerr } from "layerr";
import { getPasswordEmitter } from "../services/password";
import { getBiometricSourcePassword } from "../services/biometrics";
import { PASSWORD_VIA_BIOMETRIC_SOURCE, SHOW_PROMPT } from "../state/password";
import { showError } from "../services/notifications";
import { t } from "../../shared/i18n/trans";
import { logErr } from "../library/log";

export function PasswordPrompt() {
    const emitter = useMemo(getPasswordEmitter, []);
    const showPromptState = useHookState(SHOW_PROMPT);
    const biometricSourceState = useHookState(PASSWORD_VIA_BIOMETRIC_SOURCE);
    const [promptedBiometrics, setPromptedBiometrics] = useState(false);
    const [biometricsPromptActive, setBiometricsPromptActive] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const close = useCallback(() => {
        setCurrentPassword(""); // clear
        showPromptState.set(false);
        emitter.emit("password", null);
        setPromptedBiometrics(false);
    }, [emitter]);
    const submitAndClose = useCallback(password => {
        setCurrentPassword(""); // clear
        showPromptState.set(false);
        emitter.emit("password", password);
        setPromptedBiometrics(false);
    }, [emitter]);
    const handleKeyPress = useCallback(event => {
        if (event.key === "Enter") {
            submitAndClose(currentPassword);
        }
    }, [currentPassword]);
    useEffect(() => {
        const showPrompt = showPromptState.get();
        const sourceID = biometricSourceState.get();
        if (!showPrompt || !sourceID || promptedBiometrics) return;
        setPromptedBiometrics(true);
        setBiometricsPromptActive(true);
        getBiometricSourcePassword(sourceID)
            .then(sourcePassword => {
                setBiometricsPromptActive(false);
                if (!sourcePassword) return;
                submitAndClose(sourcePassword);
            })
            .catch(err => {
                setBiometricsPromptActive(false);
                logErr(`Failed getting biometrics password for source: ${sourceID}`, err);
                const errInfo = Layerr.info(err);
                const message = errInfo?.i18n && t(errInfo.i18n) || err.message;
                showError(message);
            });
    }, [showPromptState.get(), biometricSourceState.get(), promptedBiometrics]);
    return (
        <Dialog isOpen={showPromptState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("dialog.password-prompt.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                {!biometricsPromptActive && (
                    <FormGroup
                        label={t("dialog.password-prompt.label")}
                        labelFor="password"
                        labelInfo={t("input-required")}
                    >
                        <InputGroup
                            id="password"
                            placeholder={t("dialog.password-prompt.placeholder")}
                            type="password"
                            value={currentPassword}
                            onChange={evt => setCurrentPassword(evt.target.value)}
                            onKeyDown={handleKeyPress}
                            autoFocus
                        />
                    </FormGroup>
                )}
                {biometricsPromptActive && (
                    <NonIdealState
                        icon="hand"
                        title="Biometric authentication active"
                        description="Complete biometric authentication to unlock automatically, or cancel it to show a password input."
                    />
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={biometricsPromptActive}
                        intent={Intent.PRIMARY}
                        onClick={() => submitAndClose(currentPassword)}
                        title={t("dialog.password-prompt.button-unlock-title")}
                    >
                        {t("dialog.password-prompt.button-unlock")}
                    </Button>
                    <Button
                        onClick={close}
                        title={t("dialog.password-prompt.button-cancel-title")}
                    >
                        {t("dialog.password-prompt.button-cancel")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
