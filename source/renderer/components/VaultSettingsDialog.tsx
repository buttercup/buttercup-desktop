import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Alignment, Button, ButtonGroup, Callout, Classes, Dialog, FormGroup, Intent, Switch } from "@blueprintjs/core";
import { t } from "../../shared/i18n/trans";
import { SHOW_SETTINGS } from "../state/vaultSettings";
import { naiveClone } from "../../shared/library/clone";
import { setBusy } from "../state/app";
import { VAULT_SETTINGS_DEFAULT } from "../../shared/symbols";
import { VaultSettingsLocal } from "../types";

const PAGE_BACKUP = "backup";

const DialogFreeWidth = styled(Dialog)`
    width: 85%;
    max-width: 800px;
    min-width: 600px;
    height: 100%;
    min-height: 400px;
    max-height: 700px;
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
const PageContent = styled.div`
    flex: 1 1 auto;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 16px;
`;

export function VaultSettingsDialog() {
    const showSettings = useHookState(SHOW_SETTINGS);
    const [currentPage, setCurrentPage] = useState(PAGE_BACKUP);
    const [dirty, setDirty] = useState(false);
    const [settings, _setSettings] = useState<VaultSettingsLocal>(naiveClone(VAULT_SETTINGS_DEFAULT));
    const setPreferences = useCallback((settings: VaultSettingsLocal) => {
        _setSettings(settings);
        setDirty(true);
    }, [_setSettings]);
    const save = useCallback(() => {
        setBusy(true);
        // setBusy(true);
        // savePreferences(settings)
        //     .then(() => {
        //         showSuccess(t("notification.preferences-saved"));
        //         logInfo("Saved preferences");
        //         setDirty(false);
        //         setBusy(false);
        //         close();
        //     })
        //     .catch(err => {
        //         setBusy(false);
        //         showError(t("notification.error.preferences-save"));
        //         logErr("Failed saving preferences", err);
        //     });
    }, [settings]);
    // Pages
    const pageBackup = () => (
        <>
            <FormGroup label={t("preferences.item.secure-file-host.title")}>
                <Callout icon="info-sign">
                    <div dangerouslySetInnerHTML={{ __html: t("preferences.item.secure-file-host.description") }} />
                </Callout>
                <Switch
                    checked={preferences.fileHostEnabled}
                    label={t("preferences.item.secure-file-host.label")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setPreferences({
                        ...naiveClone(preferences),
                        fileHostEnabled: evt.target.checked
                    })}
                />
            </FormGroup>
        </>
    );
    return (
        <DialogFreeWidth isOpen={showSettings.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("preferences.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                {showSettings.get() && (
                    <SettingsContent>
                        <SettingsSidebar>
                            <SettingsMenu
                                alignText={Alignment.LEFT}
                                vertical
                            >
                                <Button
                                    active={currentPage === PAGE_BACKUP}
                                    icon="offline"
                                    onClick={() => setCurrentPage(PAGE_BACKUP)}
                                    text={t("preferences.section.connectivity")}
                                />
                                <Button
                                    disabled
                                    icon="eye-off"
                                    text={t("preferences.section.privacy")}
                                />
                                <Button
                                    disabled
                                    icon="lab-test"
                                    text={t("preferences.section.debug")}
                                />
                            </SettingsMenu>
                        </SettingsSidebar>
                        <PageContent>
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
