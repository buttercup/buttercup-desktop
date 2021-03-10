import * as React from "react";
import { useState as useHookState } from "@hookstate/core";
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { FILE_HOST_CODE } from "../state/fileHost";

const { useCallback, useMemo } = React;

export function FileHostConnectionNotice() {
    const fileHostCodeState = useHookState(FILE_HOST_CODE);
    const close = useCallback(() => {
        fileHostCodeState.set(null);
    }, []);
    return (
        <Dialog isOpen={!!fileHostCodeState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Secure File Host Connection</div>
            <div className={Classes.DIALOG_BODY}>
                <p>A new connection has been made to this application, requesting remote access to the file system.</p>
                <p>Use the following code to authorise it.</p>
                <pre>{fileHostCodeState.get()}</pre>
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
