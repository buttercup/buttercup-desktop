import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentSourceID } from "../../state/vaults";
import { useState as useHookState } from "@hookstate/core";
import { Button, FormGroup, Classes, Dialog, Intent } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans";
import { SHOW_CHANGE_VAULT_PASSWORD } from "../../state/password";
import { PasswordInputField } from "../PasswordPrompt";
import { logInfo } from "../../library/log";

function tc(key: string): string {
    return t(`dialog.change-vault-password.${key}`);
}

export function ChangeVaultPasswordDialog() {
    const showDialogState = useHookState(SHOW_CHANGE_VAULT_PASSWORD);
    const close = useCallback(() => {
        showDialogState.set(false);
    }, []);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const validNewPassword: boolean = currentPassword !== "" &&
        newPassword !== "" &&
        newPassword === newPasswordConfirm;

    const submitAndClose = (currentPassword) => {
        const currentSourceId = getCurrentSourceID();
        logInfo(`Changing password for vault ${currentSourceId}`);

        if (!currentSourceId) {
            return;
        }

    };

    return (<Dialog isOpen={showDialogState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("dialog.change-vault-password.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label={tc("current-password-label")}
                        labelFor="current-password"
                        labelInfo={t("input-required")}
                    >
                        <PasswordInputField
                            id="current-password"
                            placeholder={tc("current-password-placeholder")}
                            autoFocus={true}
                            currentPassword={currentPassword}
                            setCurrentPassword={setCurrentPassword}
                            handleKeyPress={(_) => {}}
                        />
                    </FormGroup>
                    <FormGroup
                        label={tc("new-password-label")}
                        labelFor="new-password"
                        labelInfo={t("input-required")}
                    >
                        <PasswordInputField
                            id="new-password"
                            placeholder={tc("new-password-placeholder")}
                            autoFocus={false}
                            currentPassword={newPassword}
                            setCurrentPassword={setNewPassword}
                            handleKeyPress={(_) => {}}
                        />
                    </FormGroup>
                    <FormGroup
                        label={tc("new-password-confirm-label")}
                        labelFor="new-password-confirmation"
                        labelInfo={t("input-required")}
                    >
                        <PasswordInputField
                            id="new-password-confirmation"
                            placeholder={tc("new-password-confirm-placeholder")}
                            autoFocus={false}
                            currentPassword={newPasswordConfirm}
                            setCurrentPassword={setNewPasswordConfirm}
                            handleKeyPress={(_) => {}}
                        />
                    </FormGroup>

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={!validNewPassword}
                        intent={Intent.PRIMARY}
                        onClick={() => submitAndClose(currentPassword)}
                        title={tc("button-change-title")}
                    >
                        {tc("button-change")}
                    </Button>
                    <Button
                        onClick={close}
                        title={tc("button-cancel-title")}
                    >
                        {tc("button-cancel")}
                    </Button>
                    </div>
                    </div>
                </div>
        </Dialog>);
    }
