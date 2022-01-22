import * as React from "react";
import { useState as useHookState } from "@hookstate/core";
import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import { SHOW_NEW_FILE_PROMPT } from "../../state/addVault";
import { getCreateNewFilePromptEmitter } from "../../services/addVault";
import { t } from "../../../shared/i18n/trans";

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
            <div className={Classes.DIALOG_HEADER}>{t("dialog.new-file-prompt.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                <p dangerouslySetInnerHTML={{ __html: t("dialog.new-file-prompt.prompt") }} />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        intent={Intent.WARNING}
                        onClick={chooseNew}
                        title={t("dialog.new-file-prompt.button-new.title")}
                    >
                        {t("dialog.new-file-prompt.button-new.text")}
                    </Button>
                    <Button
                        intent={Intent.PRIMARY}
                        onClick={chooseExisting}
                        title={t("dialog.new-file-prompt.button-existing.title")}
                    >
                        {t("dialog.new-file-prompt.button-existing.text")}
                    </Button>
                    <Button
                        onClick={close}
                        title={t("dialog.new-file-prompt.button-cancel.title")}
                    >
                        {t("dialog.new-file-prompt.button-cancel.text")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
