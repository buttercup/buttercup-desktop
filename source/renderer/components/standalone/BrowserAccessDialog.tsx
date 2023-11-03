import { ipcRenderer } from "electron";
import * as React from "react";
import { useSingleState } from "react-obstate";
import styled from "styled-components";
import { Layerr } from "layerr";
import { Button, Card, Classes, Dialog } from "@blueprintjs/core";
import { BROWSER_ACCESS } from "../../state/browserAccess";
import { copyText } from "../../actions/clipboard";
import { showError, showSuccess } from "../../services/notifications";
import { t } from "../../../shared/i18n/trans";

const { useCallback } = React;

const CodeCard = styled(Card)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: monospace;
    font-size: 40px;
    letter-spacing: 8px;
`;

export function BrowserAccessDialog() {
    const [code, setCode] = useSingleState(BROWSER_ACCESS, "code");
    const close = useCallback(() => {
        setCode(null);
        ipcRenderer.invoke("browser-access-code-clear").catch(err => {
            console.error(err);
            const info = Layerr.info(err);
            showError(info?.i18n && t(info.i18n) || err.message);
        });
    }, []);
    const copyCode = useCallback(async (code: string) => {
        await copyText(code);
        showSuccess(t("browser-access-dialog.code-copied"));
    }, []);
    return (
        <Dialog isOpen={!!code} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("browser-access-dialog.dialog.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                <p>{t("browser-access-dialog.dialog.instruction.new-connection")}</p>
                <p>{t("browser-access-dialog.dialog.instruction.use-code")}</p>
                <CodeCard interactive onClick={() => copyCode(code as string)}>
                    {code}
                </CodeCard>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        onClick={close}
                        title={t("browser-access-dialog.dialog.close-button-title")}
                    >
                        {t("browser-access-dialog.dialog.close-button")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
