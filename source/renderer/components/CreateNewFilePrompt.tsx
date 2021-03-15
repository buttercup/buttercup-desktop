import * as React from "react";
import { useState as useHookState } from "@hookstate/core";
import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import { SHOW_NEW_FILE_PROMPT } from "../state/addVault";
import { getCreateNewFilePromptEmitter } from "../services/addVault";

const { useCallback, useMemo } = React;

export function CreateNewFilePrompt() {
    const showPromptState = useHookState(SHOW_NEW_FILE_PROMPT);
    const emitter = useMemo(getCreateNewFilePromptEmitter, []);
    const close = useCallback(() => {
        showPromptState.set(false);
        emitter.emit("choice", null);
    }, []);
    const chooseNew = useCallback(() => {
        showPromptState.set(false);
        emitter.emit("choice", "new");
    }, [emitter]);
    const chooseExisting = useCallback(() => {
        showPromptState.set(false);
        emitter.emit("choice", "existing");
    }, [emitter]);
    return (
        <Dialog isOpen={!!showPromptState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Add Vault File</div>
            <div className={Classes.DIALOG_BODY}>
                <p>Do you wish to create a <i>new</i> vault, or read an existing one?</p>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        intent={Intent.WARNING}
                        onClick={chooseNew}
                        title="Create new vault file"
                    >
                        Create New
                    </Button>
                    <Button
                        intent={Intent.PRIMARY}
                        onClick={chooseExisting}
                        title="Loading existing vault file"
                    >
                        Load Existing
                    </Button>
                    <Button
                        onClick={close}
                        title="Close prompt"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
