import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useState as useHookState } from "@hookstate/core";
import {
    Button,
    Classes,
    Dialog,
    FormGroup,
    InputGroup,
    Intent,
    NonIdealState
} from "@blueprintjs/core";
import { Layerr } from "layerr";
import { getPasswordEmitter } from "../services/password";
import { getBiometricSourcePassword } from "../services/biometrics";
import { PASSWORD_VIA_BIOMETRIC_SOURCE, SHOW_PROMPT } from "../state/password";
import { showError } from "../services/notifications";
import { t } from "../../shared/i18n/trans";
import { logErr } from "../library/log";
import { VaultSettingsLocal } from "../../shared/types";
import { naiveClone } from "../../shared/library/clone";
import { getVaultSettings, saveVaultSettings } from "../services/vaultSettings";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function PasswordPrompt() {
    const emitter = useMemo(getPasswordEmitter, []);
    const showPromptState = useHookState(SHOW_PROMPT);
    const biometricSourceState = useHookState(PASSWORD_VIA_BIOMETRIC_SOURCE);
    const [promptedBiometrics, setPromptedBiometrics] = useState(false);
    const [biometricsPromptActive, setBiometricsPromptActive] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [settings, _setSettings] = useState<VaultSettingsLocal>(null);
    const saveAndReloadSettings = (sourceID, settings) => {
        saveVaultSettings(sourceID, settings)
            .then(() => {
                _setSettings(settings);
            })
            .catch((err) => {
                logErr("Failed saving vault settings", err);
            });
    }
    const close = useCallback(() => {
        setCurrentPassword(""); // clear
        showPromptState.set(false);
        emitter.emit("password", null);
        setPromptedBiometrics(false);
    }, [emitter]);
    const submitAndClose = useCallback(
        (password, isBioUnlock = false) => {
            setCurrentPassword(""); // clear
            showPromptState.set(false);
            emitter.emit("password", password);
            setPromptedBiometrics(false);
            const sourceID = biometricSourceState.get();
            if (isBioUnlock) {
                const biometricUnlockCount = settings.biometricUnlockCount + 1;
                const _settings = {
                    ...naiveClone(settings),
                    biometricUnlockCount
                };
                saveAndReloadSettings(sourceID, _settings);
            } else {
                if (sourceID) {
                    const _settings = {
                        ...naiveClone(settings),
                        biometricUnlockCount: 0,
                        biometricLastManualUnlock: Date.now()
                    };
                    saveAndReloadSettings(sourceID, _settings);
                }
            }
        },
        [emitter, settings]
    );
    const handleKeyPress = useCallback(
        (event) => {
            if (event.key === "Enter") {
                submitAndClose(currentPassword);
            }
        },
        [currentPassword]
    );
    useEffect(() => {
        const sourceID = biometricSourceState.get();
        if (!sourceID) return;
        getVaultSettings(sourceID)
            .then((settings) => {
                _setSettings(naiveClone(settings));
            })
            .catch((err) => {
                showError(t("notification.error.vault-settings-load"));
                logErr("Failed loading vault settings", err);
            });
    }, [biometricSourceState.get()]);
    useEffect(() => {
        if (settings === null) return;
        const showPrompt = showPromptState.get();
        const sourceID = biometricSourceState.get();
        if (!showPrompt || !sourceID || promptedBiometrics) return;
        const biometricForcePasswordCount = Number(settings.biometricForcePasswordCount) || 0;
        if (
            biometricForcePasswordCount > 0 &&
            biometricForcePasswordCount <= settings.biometricUnlockCount
        ) {
            setBiometricsPromptActive(false);
            return;
        }
        const biometricForcePasswordTimeout = Number(settings.biometricForcePasswordMaxInterval) || 0;
        if (
            biometricForcePasswordTimeout > 0 &&
            Date.now() >
                settings.biometricLastManualUnlock + ONE_DAY_IN_MS * biometricForcePasswordTimeout
        ) {
            setBiometricsPromptActive(false);
            return;
        }
        setBiometricsPromptActive(true);
        setPromptedBiometrics(true);
        getBiometricSourcePassword(sourceID)
            .then((sourcePassword) => {
                setBiometricsPromptActive(false);
                if (!sourcePassword) return;
                submitAndClose(sourcePassword, true);
            })
            .catch((err) => {
                setBiometricsPromptActive(false);
                logErr(`Failed getting biometrics password for source: ${sourceID}`, err);
                const errInfo = Layerr.info(err);
                const message = (errInfo?.i18n && t(errInfo.i18n)) || err.message;
                showError(message);
            });
    }, [showPromptState.get(), biometricSourceState.get(), promptedBiometrics, settings]);
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
                            type={showPassword ? "text" : "password"}
                            rightElement={
                                <Button
                                    icon={showPassword ? "unlock" : "lock"}
                                    intent={Intent.NONE}
                                    minimal
                                    onMouseEnter={() => {
                                        setShowPassword(true);
                                    }}
                                    onMouseLeave={() => {
                                        setShowPassword(false);
                                    }}
                                    active={showPassword}
                                    style={{ outline: "none", userSelect: "none" }}
                                />
                            }
                            value={currentPassword}
                            onChange={(evt) => setCurrentPassword(evt.target.value)}
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
                    <Button onClick={close} title={t("dialog.password-prompt.button-cancel-title")}>
                        {t("dialog.password-prompt.button-cancel")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
