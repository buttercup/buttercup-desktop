import React from "react";
import { Button, ButtonGroup, Popover, Menu, MenuItem } from "@blueprintjs/core";
import { defaultType as defaultEntryType, types as entryTypes } from "./entryTypes";
import { useActions } from "./hooks/vault";
import { t } from "../../../shared/i18n/trans";

const AddEntry = ({ disabled }) => {
    const { onAddEntry } = useActions();

    const renderMenu = (
        <Menu>
            {entryTypes.map(entryType => (
                <MenuItem
                    key={entryType.type}
                    text={t(`entry-type.title.${entryType.type}`)}
                    icon={entryType.icon}
                    label={entryType.default ? t("vault-ui.entry-type.default-label") : undefined}
                    onClick={() => onAddEntry(entryType.type || defaultEntryType)}
                />
            ))}
        </Menu>
    );

    return (
        <ButtonGroup fill>
            <Button
                icon="plus"
                text={t("vault-ui.new-entry.cta")}
                onClick={() => onAddEntry(defaultEntryType)}
                disabled={disabled}
                fill
            />
            <Popover content={renderMenu} boundary="viewport">
                <Button icon="more" disabled={disabled} fill={false} />
            </Popover>
        </ButtonGroup>
    );
};

export default AddEntry;
