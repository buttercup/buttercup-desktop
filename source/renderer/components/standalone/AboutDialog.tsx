import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Button, Card, Classes, Dialog } from "@blueprintjs/core";
import { SHOW_ABOUT } from "../../state/about";
import { CORE_VERSION, VERSION } from "../../library/version";
import { logErr } from "../../library/log";
import { getAppEnvironmentFlags } from "../../services/appEnvironment";
import { t } from "../../../shared/i18n/trans";
import { AppEnvironmentFlags } from "../../types";

const BUTTERCUP_IMG = require("../../../../resources/images/buttercup-256.png").default;

const AboutContent = styled.div`
    width: 100%;
    text-align: center;
`;
const AboutTitle = styled.h3`
    margin-top: 8px;
`;
const Logo = styled.img`
    height: 80px;
    width: auto;
`;
const VersionCard = styled(Card)`
    margin-top: 18px;
`;

function flagsToString(flags: AppEnvironmentFlags): string {
    const items: Array<string> = [];
    items.push(flags.portable ? "portable" : "installed");
    return items.join(",");
}

export function AboutDialog() {
    const showDialogState = useHookState(SHOW_ABOUT);
    const [flags, setFlags] = useState<AppEnvironmentFlags>(null);
    const flagStr = useMemo(
        () => !flags ? "" : flagsToString(flags),
        [flags]
    );
    const close = useCallback(() => {
        showDialogState.set(false);
    }, []);
    useEffect(() => {
        let mounted = true;
        getAppEnvironmentFlags()
            .then(newFlags => {
                if (!mounted) return;
                setFlags(newFlags);
            })
            .catch(err => {
                logErr("Failed fetching app-environment flags", err);
            });
        return () => {
            mounted = false;
        };
    }, []);
    return (
        <Dialog isOpen={showDialogState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("about.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                <AboutContent>
                    <Logo src={BUTTERCUP_IMG} />
                    <AboutTitle>Buttercup</AboutTitle>
                    <i>{t("about.description")}</i>
                    <VersionCard>
                        <code>
                            {t("about.version.desktop")} @ v{VERSION}
                            <br />
                            {t("about.version.core")} @ v{CORE_VERSION}
                            {flags && (
                                <Fragment>
                                    <br /><br />
                                    Flags: {flagStr}
                                </Fragment>
                            )}
                        </code>
                    </VersionCard>
                </AboutContent>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        onClick={close}
                        title={t("about.dialog.close-button-title")}
                    >
                        {t("about.dialog.close-button")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
