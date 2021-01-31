import * as React from "react";
import { Classes, Intent, IToastProps, ProgressBar } from "@blueprintjs/core";
import { getToaster } from "../components/Notifications";

export function createProgressNotification(icon: IToastProps["icon"], initialAmount = 0) {
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
        console.warn("No notifications toaster ready for notification:", message);;
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
