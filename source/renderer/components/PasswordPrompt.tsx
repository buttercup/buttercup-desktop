import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSingleState } from "react-obstate";
import { Button, Classes, Colors, Dialog, FormGroup, InputGroup, Intent, NonIdealState } from "@blueprintjs/core";
import { Layerr } from "layerr";
import ms from "ms";
import styled from "styled-components";
import { PASSWORD_STATE } from "../state/password";
import { VAULTS_STATE } from "../state/vaults";
import { getPasswordEmitter } from "../services/password";
import { getBiometricSourcePassword } from "../services/biometrics";
import { getVaultSettings, saveVaultSettings } from "../services/vaultSettings";
import { showError } from "../services/notifications";
import { logErr, logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { useSourceDetails } from "../hooks/vault";
import { VAULT_SETTINGS_DEFAULT } from "../../shared/symbols";
import { VaultSettingsLocal } from "../../shared/types";

enum PromptType {
    Biometric = "biometric",
    None = "none",
    Password = "password"
}

const DAY_MS = ms("1d");

const FallbackText = styled.i`
    color: ${Colors.RED3};
    font-weight: 500;
    display: block;
    margin-bottom: 12px;
`;
const TitleSeparator = styled.span`
    color: ${Colors.GRAY1};
    font-weight: bold;
    padding: 0px 6px;
`;
const VaultName = styled.span`
    font-weight: 600;
    font-style: italic;
`;

export function PasswordPrompt() {
    const emitter = useMemo(getPasswordEmitter, []);
    const [biometricSourceID] = useSingleState(PASSWORD_STATE, "passwordViaBiometricSource");
    const [showPrompt, setShowPrompt] = useSingleState(PASSWORD_STATE, "showPrompt");
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [sourceID] = useSingleState(VAULTS_STATE, "currentVault");
    const [sourceDetails] = useSourceDetails(sourceID);
    const [settings, setSettings] = useState<VaultSettingsLocal | null>(null);
    const [promptedBiometrics, setPromptedBiometrics] = useState<boolean>(false);
    // Callbacks
    const closePrompt = useCallback(() => {
        setCurrentPassword(""); // clear
        setShowPrompt(false);
        setPromptedBiometrics(false);
        emitter.emit("password", null);
    }, [emitter, setShowPrompt]);
    const submitPasswordPrompt = useCallback((password: string, usedBiometrics: boolean) => {
        emitter.emit("password", password, usedBiometrics);
        setShowPrompt(false);
        setCurrentPassword("");
        setPromptedBiometrics(false);
    }, [emitter, setShowPrompt]);
    const handleKeyPress = useCallback(
        (event) => {
            if (event.key === "Enter") {
                submitPasswordPrompt(currentPassword, false);
            }
        },
        [currentPassword, submitPasswordPrompt]
    );
    // Living data
    const [promptType, fallbackReason] = useMemo<[PromptType, string | null]>(() => {
        if (!showPrompt) return [PromptType.None, null];
        const currentSettings = settings || { ...VAULT_SETTINGS_DEFAULT };
        const {
            biometricForcePasswordCount,
            biometricForcePasswordMaxInterval,
            biometricLastManualUnlock,
            biometricUnlockCount
        } = currentSettings;
        const bioPassCount = parseInt(biometricForcePasswordCount, 10);
        const bioInterval = parseInt(biometricForcePasswordMaxInterval, 10);
        const bioPassCountExceeded = !isNaN(bioPassCount) && bioPassCount > 0 && biometricUnlockCount >= bioPassCount;
        const bioIntervalPassed = !isNaN(bioInterval) &&
            bioInterval > 0 &&
            typeof biometricLastManualUnlock === "number" &&
            biometricLastManualUnlock < (Date.now() - (bioInterval * DAY_MS));
        if (biometricSourceID && biometricSourceID === sourceID) {
            if (bioPassCountExceeded) {
                return [PromptType.Password, t("dialog.password-prompt.biometric-fallback.unlock-count-exceeded")];
            } else if (bioIntervalPassed) {
                return [PromptType.Password, t("dialog.password-prompt.biometric-fallback.unlock-period-exceeded")];
            }
            return [PromptType.Biometric, null];
        } else if (sourceID) {
            return [PromptType.Password, null];
        }
        return [PromptType.None, null];
    }, [biometricSourceID, sourceID, settings, showPrompt]);
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
    const promptBiometrics = useCallback(async () => {
        if (!biometricSourceID) {
            throw new Error("Environment not ready for biometric prompt");
        }
        const sourcePassword = await getBiometricSourcePassword(biometricSourceID);
        if (!sourcePassword) return;
        submitPasswordPrompt(sourcePassword, true);
    }, [biometricSourceID, submitPasswordPrompt]);
    useEffect(() => {
        if (!showPrompt || promptType !== PromptType.Biometric || promptedBiometrics || !biometricSourceID) return;
        const timeout = setTimeout(() => {
            setPromptedBiometrics(true);
            promptBiometrics().catch((err) => {
                logErr(`Failed getting biometrics password for source: ${sourceID}`, err);
                const errInfo = Layerr.info(err);
                const message = (errInfo?.i18n && t(errInfo.i18n)) || err.message;
                showError(message);
            });
        }, 250);
        return () => {
            clearTimeout(timeout);
        };
    }, [biometricSourceID, promptBiometrics, promptType, showPrompt]);
    // Render
    return (
        <Dialog isOpen={showPrompt} onClose={closePrompt}>
            <div className={Classes.DIALOG_HEADER}>
                <span>{t("dialog.password-prompt.title")}</span>
                {sourceDetails && (
                    <Fragment>
                        <TitleSeparator>•</TitleSeparator>
                        <VaultName>{sourceDetails.name}</VaultName>
                    </Fragment>
                )}
            </div>
            <div className={Classes.DIALOG_BODY}>
                {promptType === PromptType.Password && (
                    <>
                        {fallbackReason && (
                            <FallbackText>{fallbackReason}</FallbackText>
                        )}
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
                    </>
                )}
                {promptType === PromptType.Biometric && (
                    <NonIdealState
                        icon="hand"
                        title={t("dialog.password-prompt.biometrics-enabled.title")}
                        description={t("dialog.password-prompt.biometrics-enabled.description")}
                    />
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={promptType !== PromptType.Password}
                        intent={Intent.PRIMARY}
                        onClick={() => submitPasswordPrompt(currentPassword, false)}
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
