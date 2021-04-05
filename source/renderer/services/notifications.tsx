import * as React from "react";
import { Classes, Intent, IToastProps, ProgressBar } from "@blueprintjs/core";
import { getToaster, getUpdateToaster } from "../components/Notifications";
import { logWarn } from "../library/log";
import { t } from "../../shared/i18n/trans";

export interface ProgressNotification {
    clear: (message: any, intent: Intent, timeout?: number) => void;
    setProgress: (progress: number) => void;
}

export function createProgressNotification(icon: IToastProps["icon"], initialAmount = 0): ProgressNotification {
    const key = `prog${Math.floor(Math.random() * 999999)}`;
    const update = (amount = initialAmount, timeout = 0) => {
        const toaster = getToaster();
        toaster.show({
            icon,
            message: (
                <ProgressBar
                    className={Classes.PROGRESS_NO_STRIPES}
                    intent={Intent.PRIMARY}
                    value={amount / 100}
                />
            ),
            timeout: 0
        }, key);
    };
    const clear = (message: any, intent: Intent, timeout: number) => {
        const toaster = getToaster();
        toaster.show({
            icon,
            intent,
            message,
            timeout
        }, key);
    };
    update();
    return {
        clear: (message: any, intent: Intent, timeout = 5000) => clear(message, intent, timeout),
        setProgress: (progress: number) => update(progress)
    };
}

export function showError(message: string) {
    showNotification(message, Intent.DANGER, 10000);
}

function showNotification(message: any, intent: Intent = Intent.NONE, timeout: number = 5000) {
    const toaster = getToaster();
    if (!toaster) {
        logWarn("No notifications toaster ready for notification:", message);;
    }
    toaster.show({
        message,
        intent,
        timeout
    });
}

export function showSuccess(message: string) {
    showNotification(message, Intent.SUCCESS);
}

export function showUpdateAvailable(version: string, onUpdate: () => void, onCancel: () => void) {
    const key = `upd${Math.floor(Math.random() * 999999)}`;
    const toaster = getUpdateToaster();
    let closed = false;
    toaster.show({
        icon: "automatic-updates",
        intent: Intent.PRIMARY,
        message: t("update.available", { version }),
        timeout: 0,
        onDismiss: (didTimeoutExpire: boolean) => {
            if (closed) return;
            if (!didTimeoutExpire) onCancel();
        },
        action: {
            text: t("update.view"),
            onClick: () => {
                closed = true;
                onUpdate();
            },
        }
    }, key);
}

export function showUpdateDownloaded(version: string, onUpdate: () => void, onCancel: () => void) {
    const key = `upd-down${Math.floor(Math.random() * 999999)}`;
    const toaster = getUpdateToaster();
    let closed = false;
    toaster.show({
        icon: "compressed",
        intent: Intent.PRIMARY,
        message: t("update.ready", { version }),
        timeout: 0,
        onDismiss: (didTimeoutExpire: boolean) => {
            if (closed) return;
            if (!didTimeoutExpire) onCancel();
        },
        action: {
            text: t("update.installed-restart"),
            onClick: () => {
                closed = true;
                onUpdate();
            },
        }
    }, key);
}

export function showUpdateError(message: string) {
    const toaster = getUpdateToaster();
    toaster.show({
        message: `Update failed: ${message}`,
        intent: Intent.DANGER,
        timeout: 15000
    });
}

export function showWarning(message: string) {
    showNotification(message, Intent.WARNING, 10000);
}
