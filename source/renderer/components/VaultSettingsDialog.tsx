import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Alignment, Button, ButtonGroup, Callout, Classes, Dialog, FormGroup, Icon, InputGroup, Intent, Switch, Text } from "@blueprintjs/core";
import { VaultFormatID } from "buttercup";
import { t } from "../../shared/i18n/trans";
import { SHOW_VAULT_SETTINGS } from "../state/vaultSettings";
import { naiveClone } from "../../shared/library/clone";
import { setBusy } from "../state/app";
import { VAULT_SETTINGS_DEFAULT } from "../../shared/symbols";
import { useSourceDetails } from "../hooks/vault";
import { getVaultSettings, saveVaultSettings } from "../services/vaultSettings";
import { logErr, logInfo } from "../library/log";
import { VaultSettingsLocal } from "../types";
import { showError, showSuccess } from "../services/notifications";

const PAGE_BACKUP = "backup";
const PAGE_FORMAT = "format";

const DialogFreeWidth = styled(Dialog)`
    width: 85%;
    max-width: 800px;
    min-width: 600px;
    height: 100%;
    min-height: 400px;
    max-height: 700px;
`;
const FormatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    width: 50%;
    padding: 24px;
    width: calc(100%-48px);
    height: calc(100%-48px);
`;
const FormatDescriptionContainer = styled.div`
    width: 50%;
    padding: 24px;
    flex: 0 0 auto;
    text-align: center;
`;
const FormatDescriptionText = styled(Text)`
    margin-bottom: 8px;
`;
const FormatTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    margin-top: 16px;
`;
const PageContent = styled.div`
    flex: 1 1 auto;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 16px;
`;
const SettingsContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;
const SettingsMenu = styled(ButtonGroup)`
    width: 100%;
`;
const SettingsSidebar = styled.div`
    width: 140px;
    flex: 0 0 auto;
    margin-right: 6px;
`;
const SplitSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
`;

export function VaultSettingsDialog() {
    const showSettingsState = useHookState(SHOW_VAULT_SETTINGS);
    const [currentPage, setCurrentPage] = useState(PAGE_FORMAT);
    const [dirty, setDirty] = useState(false);
    const [settings, _setSettings] = useState<VaultSettingsLocal>(naiveClone(VAULT_SETTINGS_DEFAULT));
    const { id: sourceID, name: vaultName } = useSourceDetails(showSettingsState.get()) || {};
    const [vaultFormat, setVaultFormat] = useState<VaultFormatID>(VaultFormatID.A);
    const setSettings = useCallback((settings: VaultSettingsLocal) => {
        _setSettings(settings);
        setDirty(true);
    }, [_setSettings]);
    const close = useCallback(() => {
        showSettingsState.set(null);
        setCurrentPage(PAGE_FORMAT);
    }, []);
    const save = useCallback(() => {
        setBusy(true);
        saveVaultSettings(sourceID, settings)
            .then(() => {
                showSuccess(t("notification.vault-settings-saved"));
                logInfo("Saved vault settings");
                setDirty(false);
                setBusy(false);
                close();
            })
            .catch(err => {
                setBusy(false);
                showError(t("notification.error.vault-settings-save"));
                logErr("Failed saving vault settings", err);
            });
    }, [settings, sourceID]);
    useEffect(() => {
        if (!sourceID) return;
        getVaultSettings(sourceID)
            .then(settings => {
                _setSettings(naiveClone(settings));
                setDirty(false);
            })
            .catch(err => {
                showError(t("notification.error.vault-settings-load"));
                logErr("Failed loading vault settings", err);
                showSettingsState.set(null);
            });
    }, [sourceID]);
    // Pages
    const pageFormat = () => (
        <>
            <FormGroup label={t("vault-settings.format.title")}>
                <Callout icon="info-sign">
                    <div dangerouslySetInnerHTML={{ __html: t("vault-settings.format.description") }} />
                </Callout>
                <SplitSection>
                    <FormatContainer>
                        <Icon icon="data-connection" size={60} />
                        <FormatTitle>{t("vault-settings.format.format-type", { format: vaultFormat.toUpperCase() })}</FormatTitle>
                    </FormatContainer>
                    <FormatDescriptionContainer>
                        <FormatDescriptionText>{t("vault-settings.format.a-description")}</FormatDescriptionText>
                        {vaultFormat === VaultFormatID.A && (
                            <>
                                <FormatDescriptionText dangerouslySetInnerHTML={{ __html: t("vault-settings.format.a-upgrade-b") }} />
                                <Button disabled text="Upgrade" icon="circle-arrow-up" intent={Intent.DANGER} />
                            </>
                        )}
                    </FormatDescriptionContainer>
                </SplitSection>
            </FormGroup>
        </>
    );
    const pageBackup = () => (
        <>
            <FormGroup label={t("vault-settings.backup.title")}>
                <Callout icon="info-sign">
                    <div dangerouslySetInnerHTML={{ __html: t("vault-settings.backup.description") }} />
                </Callout>
                <Switch
                    checked={settings.localBackup}
                    label={t("vault-settings.backup.switch")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setSettings({
                        ...naiveClone(settings),
                        localBackup: evt.target.checked
                    })}
                />
            </FormGroup>
            <FormGroup label={t("vault-settings.backup.path.label")} helperText={t("vault-settings.backup.path.helper")}>
                <InputGroup
                    disabled={!settings.localBackup}
                    placeholder={t("vault-settings.backup.path.placeholder")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setSettings({
                        ...naiveClone(settings),
                        localBackupLocation: evt.target.value || null
                    })}
                    value={settings.localBackupLocation || ""}
                />
            </FormGroup>
        </>
    );
    return (
        <DialogFreeWidth isOpen={showSettingsState.get() !== null} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("vault-settings.title", { title: vaultName || "" })}</div>
            <div className={Classes.DIALOG_BODY}>
                {showSettingsState.get() && (
                    <SettingsContent>
                        <SettingsSidebar>
                            <SettingsMenu
                                alignText={Alignment.LEFT}
                                vertical
                            >
                                <Button
                                    active={currentPage === PAGE_FORMAT}
                                    icon="database"
                                    onClick={() => setCurrentPage(PAGE_FORMAT)}
                                    text={t("vault-settings.format.title")}
                                />
                                <Button
                                    active={currentPage === PAGE_BACKUP}
                                    icon="duplicate"
                                    onClick={() => setCurrentPage(PAGE_BACKUP)}
                                    text={t("vault-settings.backup.title")}
                                />
                            </SettingsMenu>
                        </SettingsSidebar>
                        <PageContent>
                            {currentPage === PAGE_FORMAT && pageFormat()}
                            {currentPage === PAGE_BACKUP && pageBackup()}
                        </PageContent>
                    </SettingsContent>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={!dirty}
                        intent={Intent.PRIMARY}
                        onClick={() => save()}
                        title={t("preferences.button.save-title")}
                    >
                        {t("preferences.button.save")}
                    </Button>
                    <Button
                        onClick={close}
                        title={t("preferences.button.cancel-title")}
                    >
                        {t("preferences.button.cancel")}
                    </Button>
                </div>
            </div>
        </DialogFreeWidth>
    );
}
