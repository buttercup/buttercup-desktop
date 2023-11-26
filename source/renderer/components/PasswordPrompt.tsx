import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSingleState } from "react-obstate";
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent, NonIdealState } from "@blueprintjs/core";
import { Layerr } from "layerr";
import { PASSWORD_STATE } from "../state/password";
import { VAULTS_STATE } from "../state/vaults";
import { getPasswordEmitter } from "../services/password";
import { getBiometricSourcePassword } from "../services/biometrics";
import { getVaultSettings, saveVaultSettings } from "../services/vaultSettings";
import { showError } from "../services/notifications";
import { logErr, logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { VAULT_SETTINGS_DEFAULT } from "../../shared/symbols";
import { VaultSettingsLocal } from "../../shared/types";

enum PromptType {
    Biometric = "biometric",
    None = "none",
    Password = "password"
}

export function PasswordPrompt() {
    const emitter = useMemo(getPasswordEmitter, []);
    const [biometricSourceID] = useSingleState(PASSWORD_STATE, "passwordViaBiometricSource");
    const [showPrompt, setShowPrompt] = useSingleState(PASSWORD_STATE, "showPrompt");
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [sourceID] = useSingleState(VAULTS_STATE, "currentVault");
    const [settings, setSettings] = useState<VaultSettingsLocal | null>(null);
    // const [promptType, setPromptType] = useState<PromptType>(PromptType.Password);
    const [promptedBiometrics, setPromptedBiometrics] = useState<boolean>(false);
    // Callbacks
    const closePrompt = useCallback(() => {
        setCurrentPassword(""); // clear
        // setPromptType(PromptType.None);
        setShowPrompt(false);
        setPromptedBiometrics(false);
        emitter.emit("password", null);
    }, [emitter, setShowPrompt]);
    const submitPasswordPrompt = useCallback((password: string) => {
        emitter.emit("password", password);
        setShowPrompt(false);
        setCurrentPassword("");
        // setPromptType(PromptType.None);
        setPromptedBiometrics(false);
    }, [emitter, setShowPrompt]);
    const handleKeyPress = useCallback(
        (event) => {
            if (event.key === "Enter") {
                submitPasswordPrompt(currentPassword);
            }
        },
        [currentPassword, submitPasswordPrompt]
    );
    // Living data
    const promptType = useMemo(() => {
        let type: PromptType = PromptType.None;
        if (biometricSourceID && biometricSourceID === sourceID) {
            return PromptType.Biometric;
        } else if (sourceID) {
            return PromptType.Password;
        }
        logInfo(`detect prompt for vault unlock: ${type} (${sourceID})`);
        return PromptType.None;
    }, [biometricSourceID, sourceID, settings]);
    // Helpers
    const updateVaultSettings = useCallback(async (): Promise<VaultSettingsLocal> => {
        if (!sourceID) {
            const newSettings = {
                ...VAULT_SETTINGS_DEFAULT
            };
            setSettings(newSettings);
            return newSettings;
        }
        return getVaultSettings(sourceID)
            .then(newSettings => {
                setSettings(newSettings);
                return newSettings;
            })
            .catch(err => {
                showError(t("error.vault-settings-fetch-failed"));
                logErr("Failed loading vault settings", err);
                return {
                    ...VAULT_SETTINGS_DEFAULT
                };
            });
    }, [sourceID]);
    // Effects
    useEffect(() => {
        updateVaultSettings();
    }, [updateVaultSettings]);
    useEffect(() => {
        if (!showPrompt) return;
        updateVaultSettings();
    }, [showPrompt, updateVaultSettings]);
    useEffect(() => {
        if (!showPrompt || promptType !== PromptType.Biometric || promptedBiometrics || !biometricSourceID) return;
        setPromptedBiometrics(true);
        getBiometricSourcePassword(biometricSourceID)
            .then((sourcePassword) => {
                if (!sourcePassword) return;
                submitPasswordPrompt(sourcePassword);
            })
            .catch((err) => {
                logErr(`Failed getting biometrics password for source: ${sourceID}`, err);
                const errInfo = Layerr.info(err);
                const message = (errInfo?.i18n && t(errInfo.i18n)) || err.message;
                showError(message);
            });
    }, [biometricSourceID, promptedBiometrics, promptType, showPrompt, submitPasswordPrompt]);
    // Render
    return (
        <Dialog isOpen={showPrompt} onClose={closePrompt}>
            <div className={Classes.DIALOG_HEADER}>{t("dialog.password-prompt.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                {promptType === PromptType.Password && (
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
                {promptType === PromptType.Biometric && (
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
                        disabled={promptType !== PromptType.Password}
                        intent={Intent.PRIMARY}
                        onClick={() => submitPasswordPrompt(currentPassword)}
                        title={t("dialog.password-prompt.button-unlock-title")}
                    >
                        {t("dialog.password-prompt.button-unlock")}
                    </Button>
                    <Button onClick={closePrompt} title={t("dialog.password-prompt.button-cancel-title")}>
                        {t("dialog.password-prompt.button-cancel")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
