import * as React from "react";
import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans";

export interface ConfirmDialogProps {
    cancelText?: string;
    children: React.ReactNode;
    confirmIntent?: Intent;
    confirmText?: string;
    onClose: (confirmed: boolean) => void;
    open: boolean;
    title: string;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
    const {
        cancelText = t("dialog.confirm-generic.cancel-button"),
        children,
        confirmIntent = Intent.PRIMARY,
        confirmText = t("dialog.confirm-generic.confirm-button"),
        onClose,
        open,
        title
    } = props;
    return (
        <Dialog isOpen={open} onClose={() => onClose(false)}>
            <div className={Classes.DIALOG_HEADER}>{title}</div>
            <div className={Classes.DIALOG_BODY}>
                {children}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        intent={confirmIntent}
                        onClick={() => onClose(true)}
                    >
                        {confirmText}
                    </Button>
                    <Button
                        onClick={() => onClose(false)}
                    >
                        {cancelText}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
