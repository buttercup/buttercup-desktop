import React from "react";
import { Classes, Intent, Popover, Button, H5, IconName, MaybeElement } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans";

export function ConfirmButton(
    { icon, danger = false, disabled = false, title, description, primaryAction, onClick }: {
        danger?: boolean;
        description: string;
        disabled?: boolean;
        icon: IconName | MaybeElement;
        onClick: () => void;
        primaryAction: string;
        title: string;
    }
) {
    return (
        <Popover popoverClassName={Classes.POPOVER_CONTENT_SIZING}>
            <Button disabled={disabled} icon={icon} intent={danger ? Intent.DANGER : Intent.NONE} />
            <div className={Classes.UI_TEXT}>
                <H5>{title}</H5>
                <p>{description}</p>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text={t("vault-ui.cancel")} className={Classes.POPOVER_DISMISS} disabled={disabled} />
                    <Button
                        text={primaryAction}
                        onClick={onClick}
                        className={Classes.POPOVER_DISMISS}
                        disabled={disabled}
                        intent={danger ? Intent.DANGER : Intent.PRIMARY}
                    />
                </div>
            </div>
        </Popover>
    );
}
