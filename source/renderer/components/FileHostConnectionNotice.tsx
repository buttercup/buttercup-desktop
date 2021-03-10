import * as React from "react";
import { useState as useHookState } from "@hookstate/core";
import styled from "styled-components";
import { Button, Card, Classes, Dialog } from "@blueprintjs/core";
import { FILE_HOST_CODE } from "../state/fileHost";
import { copyText } from "../actions/clipboard";
import { showSuccess } from "../services/notifications";

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

export function FileHostConnectionNotice() {
    const fileHostCodeState = useHookState(FILE_HOST_CODE);
    const close = useCallback(() => {
        fileHostCodeState.set(null);
    }, []);
    const copyCode = useCallback(async (code: string) => {
        await copyText(code);
        showSuccess("File host code copied");
    }, []);
    return (
        <Dialog isOpen={!!fileHostCodeState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Secure File Host Connection</div>
            <div className={Classes.DIALOG_BODY}>
                <p>A new connection has been made to this application, requesting remote access to the file system.</p>
                <p>Use the following code to authorise it.</p>
                <CodeCard interactive onClick={() => copyCode(fileHostCodeState.get())}>
                    {fileHostCodeState.get()}
                </CodeCard>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        onClick={close}
                        title="Close connection dialog"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
