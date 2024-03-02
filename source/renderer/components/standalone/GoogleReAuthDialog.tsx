import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Button, Classes, Dialog } from "@blueprintjs/core";
import { authenticateGoogleDrive, updateGoogleTokensForSource } from "../../services/authGoogle";
import { GOOGLE_REAUTH_SOURCE } from "../../state/google";
import { setBusy } from "../../state/app";
import { useSourceDetails } from "../../hooks/vault";
import { t } from "../../../shared/i18n/trans";
import { logErr } from "../../library/log";
import { showError, showSuccess } from "../../services/notifications";

const GOOGLE_IMG = require("../../../../resources/images/google-256.png").default;

const DialogContent = styled.div`
    width: 100%;
    text-align: center;
`;
const DialogHeader = styled.h3`
    margin-top: 8px;
`;
const Logo = styled.img`
    height: 42px;
    width: auto;
`;

export function GoogleReAuthDialog() {
    const googleReAuthState = useHookState(GOOGLE_REAUTH_SOURCE);
    const sourceID = googleReAuthState.get();
    const [details] = useSourceDetails(sourceID);
    const vaultName = useMemo(() => details?.name ?? "", [details]);
    const [calledAuthenticate, setCalledAuthenticate] = useState<boolean>(false);
    const close = useCallback(() => {
        googleReAuthState.set(null);
    }, [googleReAuthState]);
    const authenticate = useCallback(() => {
        setBusy(true);
        authenticateGoogleDrive()
            .then(tokens => updateGoogleTokensForSource(sourceID, tokens))
            .then(() => {
                setBusy(false);
                showSuccess(t("dialog.google-reauth.success"));
                close();
            })
            .catch(err => {
                logErr(err);
                setBusy(false);
                showError(`${t("dialog.google-reauth.error.reauth-failed")}: ${err.message}`);
            });
    }, [close, sourceID]);
    useEffect(() => {
        if (calledAuthenticate || !sourceID) return;
        const delayStart = setTimeout(() => {
            setCalledAuthenticate(true);
            authenticate();
        }, 500);
        return () => {
            clearTimeout(delayStart);
        };
    }, [calledAuthenticate, sourceID]);
    return (
        <Dialog isOpen={!!sourceID} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("dialog.google-reauth.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                <DialogContent>
                    <Logo src={GOOGLE_IMG} />
                    <DialogHeader>{t("dialog.google-reauth.header")}</DialogHeader>
                    <i>{t("dialog.google-reauth.description", { vault: vaultName })}</i>
                </DialogContent>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        onClick={close}
                        title={t("dialog.google-reauth.close-button.title")}
                    >
                        {t("dialog.google-reauth.close-button.text")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
