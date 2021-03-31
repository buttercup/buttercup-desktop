import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Button, Card, Classes, Dialog, Intent } from "@blueprintjs/core";
import { muteCurrentUpdate, startCurrentUpdate } from "../services/update";
import { CURRENT_UPDATE, SHOW_UPDATE_DIALOG } from "../state/update";
import { t } from "../../shared/i18n/trans";

const ReleaseHeading = styled.h2`
    margin-top: 0px;
`;

export function UpdateDialog() {
    const showDialogState = useHookState(SHOW_UPDATE_DIALOG);
    const currentUpdateState = useHookState(CURRENT_UPDATE);
    const currentUpdate = currentUpdateState.get();
    const version = currentUpdate ? currentUpdate.version : null;
    const close = useCallback(() => {
        showDialogState.set(false);
        currentUpdateState.set(null);
        muteCurrentUpdate();
    }, []);
    const update = useCallback(() => {
        showDialogState.set(false);
        startCurrentUpdate();
    }, []);
    return (
        <Dialog isOpen={showDialogState.get() && !!currentUpdateState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("update.dialog.title", { version })}</div>
            <div className={Classes.DIALOG_BODY}>
                {currentUpdate && (
                    <ReleaseHeading dangerouslySetInnerHTML={{ __html: currentUpdate.releaseName }} />
                )}
                {currentUpdate && (
                    <Card>
                        <div dangerouslySetInnerHTML={{ __html: currentUpdate.releaseNotes as string }} />
                    </Card>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        intent={Intent.PRIMARY}
                        onClick={update}
                        title={t("update.dialog.update-button-title")}
                    >
                        {t("update.dialog.update-button")}
                    </Button>
                    <Button
                        onClick={close}
                        title={t("update.dialog.close-button-title")}
                    >
                        {t("update.dialog.close-button")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
