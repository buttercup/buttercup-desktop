import React, { useContext, useState, useRef, useEffect, Fragment } from "react";
import styled, { css } from "styled-components";
import { Colors, Text, Classes, Menu, MenuItem, ContextMenu, MenuDivider } from "@blueprintjs/core";
import {
    DEFAULT_ENTRY_TYPE,
    EntryType,
    EntryURLType,
    fieldsToProperties,
    getEntryURLs
} from "buttercup";
import { EntryFacade } from "buttercup";
import { SiteIcon } from "./SiteIcon";
import { useGroups } from "./hooks/vault";
import { VaultContext } from "./VaultContext";
import { extractDomain } from "./utils/domain";
import { getThemeProp } from "./utils/theme";
import { getFacadeField } from "./utils/ui";
import { COLOURS } from "../../../shared/symbols";
import { t } from "../../../shared/i18n/trans";
import { GroupTreeNodeInfo } from "./types";

function getEntryDomain(entry: EntryFacade): string | null {
    const properties = fieldsToProperties(entry.fields);
    const [url] = [
        ...getEntryURLs(properties, EntryURLType.Icon),
        ...getEntryURLs(properties, EntryURLType.Any)
    ];
    return url ? extractDomain(url) : null;
}

function title(entry: EntryFacade): string | JSX.Element {
    return getFacadeField(entry, "title") || <i>(Untitled)</i>;
}

function username(entry: EntryFacade): string | JSX.Element {
    if (entry.type === EntryType.Note) {
        const note = getFacadeField(entry, "note");
        return (note && note.slice(0, 60)) || <i>Empty</i>;
    } else if (entry.type === EntryType.SSHKey) {
        const key = getFacadeField(entry, "publicKey");
        return (key && key.slice(0, 60)) || <i>Empty</i>;
    }
    return getFacadeField(entry, "username") || <i>No username</i>;
}

const EntryWrapper = styled.div<{
    focused?: boolean;
    selected?: boolean;
}>`
    padding: 0.5rem;
    user-select: none;
    cursor: pointer;
    border-radius: 3px;
    color: inherit;
    background-color: transparent;
    display: flex;
    align-items: center;

    &:focus {
        background-color: ${props => getThemeProp(props, "list.focusedBackgroundColor")};
        outline-color: ${COLOURS .BRAND_PRIMARY};
        outline-style: solid;
    }

    ${props =>
        props.focused &&
        css`
            background-color: ${props => getThemeProp(props, "list.focusedBackgroundColor")};
        `}

    ${props =>
        props.selected &&
        css`
            background-color: ${props =>
                getThemeProp(props, "list.selectedBackgroundColor")} !important;
            color: ${props => getThemeProp(props, "list.selectedTextColor")};
        `}
`;

const ImageWrapper = styled.figure`
    padding: 0;
    margin: 0;
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 2.5rem;
    border: 1px solid ${Colors.GRAY5};
    border-radius: 3px;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.4);
    margin-right: 1rem;
    flex: 0 0 2.5rem;

    img {
        width: 100%;
        height: auto;
        display: block;
    }
`;

const SecondaryText = styled(Text)`
    opacity: 0.7;
    margin-top: 0.1rem;
`;

const ContentWrapper = styled.div`
    flex: 1;
    /*
   * flex issue
   * https://css-tricks.com/flexbox-truncated-text/
  */
    min-width: 0;
`;

export function Entry({ entry, selected, onClick, innerRef, ...props }) {
    const [contextMenuOpen, setContextMenuVisibility] = useState(false);
    const { groups, onMoveEntryToGroup, onMoveEntryToTrash, trashID } = useGroups();
    const { iconsEnabled, readOnly } = useContext(VaultContext);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false
        };
    }, []);

    const handleMove = parentID => e => {
        onMoveEntryToGroup(entry.id, parentID);
    };

    const renderGroupsMenu = (items: Array<GroupTreeNodeInfo>, parentNode?: GroupTreeNodeInfo) => (
        <>
            {parentNode && (
                <>
                    <MenuItem
                        text={t(`entry-menu.move-to-parent`, { group: parentNode.label })}
                        key={parentNode.id}
                        icon={parentNode.icon}
                        onClick={handleMove(parentNode.id)}
                        disabled={entry.parentID === parentNode.id || readOnly}
                    />
                    <MenuDivider />
                </>
            )}
            {items.map(group => (
                <Fragment key={group.id}>
                    {group.childNodes.length > 0 && (
                        <MenuItem
                            text={group.label}
                            key={group.id}
                            icon={group.icon}
                            onClick={handleMove(group.id)}
                            disabled={readOnly}
                        >
                            {renderGroupsMenu(group.childNodes, group)}
                        </MenuItem>
                    ) || (
                        <MenuItem
                            text={group.label}
                            key={group.id}
                            icon={group.icon}
                            onClick={handleMove(group.id)}
                            disabled={entry.parentID === group.id || readOnly}
                        />
                    )}
                </Fragment>
            ))}
        </>
    );

    const showContextMenu = e => {
        e.preventDefault();
        setContextMenuVisibility(true);
        ContextMenu.show(
            <Menu>
                <MenuItem text={t("vault-ui.entry-menu.move-to")} icon="add-to-folder">
                    {renderGroupsMenu(groups)}
                </MenuItem>
                {entry.parentID !== trashID && (
                    <MenuItem
                        text={t("vault-ui.entry-menu.move-to-trash")}
                        icon="trash"
                        onClick={() => onMoveEntryToTrash(entry.id)}
                        disabled={readOnly}
                    />
                )}
            </Menu>,
            { left: e.clientX, top: e.clientY },
            () => {
                if (mounted.current) {
                    setContextMenuVisibility(false);
                }
            }
        );
    };

    return (
        <EntryWrapper
            selected={selected}
            focused={contextMenuOpen}
            onClick={onClick}
            ref={innerRef}
            onContextMenu={showContextMenu}
            {...props}
        >
            <ImageWrapper>
                <SiteIcon
                    domain={iconsEnabled ? getEntryDomain(entry) : null}
                    type={entry.type || DEFAULT_ENTRY_TYPE}
                />
            </ImageWrapper>
            <ContentWrapper>
                <Text ellipsize>{title(entry)}</Text>
                <SecondaryText ellipsize className={Classes.TEXT_SMALL}>
                    {username(entry)}
                </SecondaryText>
            </ContentWrapper>
        </EntryWrapper>
    );
}
