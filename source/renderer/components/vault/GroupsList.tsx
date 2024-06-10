import React, { useCallback, useEffect, useState, useRef, useContext, Fragment } from "react";
import { GroupFacade, GroupID } from "buttercup";
import styled from "styled-components";
import {
    Alignment,
    Button,
    Classes,
    ContextMenu,
    Dialog,
    InputGroup,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Tag,
    Tree as BaseTree
} from "@blueprintjs/core";
import { useGroups } from "./hooks/vault";
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from "./Pane";
import { VaultContext } from "./VaultContext";
import { getThemeProp } from "./utils/theme";
import { t } from "../../../shared/i18n/trans";
import { GroupTreeNodeInfo } from "./types";

const KEYCODE_ENTER = 13;

const Tree = styled(BaseTree)`
    .node {
        &[class*="node-selected"] {
            > [class*="node-content"] {
                background-color: ${props =>
                    getThemeProp(props, "tree.selectedBackgroundColor")} !important;
                color: ${props => getThemeProp(props, "tree.selectedTextColor")};
                > [icon] {
                    color: ${props => getThemeProp(props, "tree.selectedIconColor")} !important;
                }
            }
        }
        > [class*="node-content"] {
            border-radius: 3px;
            cursor: pointer;

            &:hover {
                background-color: ${props => getThemeProp(props, "tree.hoverBackgroundColor")};
            }
        }
    }
`;

export const GroupsList = () => {
    const [groupsContextOpen, setGroupsContextOpen] = useState(false);
    const [groupEditID, setGroupEditID] = useState<GroupID | -1 | null>(null);
    const [parentGroupID, setParentGroupID] = useState<GroupID | null>(null);
    const [newGroupName, setNewGroupName] = useState("");
    const groupTitleInputRef = useRef<HTMLInputElement | null>(null);
    const [trashOpen, setTrashOpen] = useState(false);
    const [emptyingTrash, setEmptyingTrash] = useState(false);
    const {
        groups,
        groupsRaw,
        emptyTrash,
        selectedGroupID,
        onCreateGroup,
        onMoveGroup,
        onMoveGroupToTrash,
        onRenameGroup,
        onSelectGroup,
        onCollapseGroup,
        onExpandGroup,
        filters,
        onGroupFilterTermChange,
        onGroupFilterSortModeChange,
        trashID,
        trashCount,
        trashGroupCount,
        trashSelected,
        trashGroups
    } = useGroups();
    const { readOnly } = useContext(VaultContext);

    useEffect(() => {
        if (groupTitleInputRef && groupTitleInputRef.current) {
            groupTitleInputRef.current.focus();
        }
    }, [groupTitleInputRef.current]);

    const closeEditDialog = () => {
        setGroupEditID(null);
        setNewGroupName("");
        setParentGroupID(null);
    };

    const handleTrashClick = useCallback(() => {
        const trashNowOpen = !trashOpen;
        setTrashOpen(trashNowOpen);
        onSelectGroup(trashNowOpen && trashID ? trashID : null);
    }, [trashOpen]);

    const handleTrashEmpty = useCallback(() => {
        setEmptyingTrash(false);
        emptyTrash();
    }, [emptyTrash]);

    const editGroup = (groupFacade: GroupFacade | null = null, parentID: GroupID | null = null) => {
        setGroupEditID(groupFacade ? groupFacade.id : -1);
        setNewGroupName(groupFacade ? groupFacade.title : "");
        setParentGroupID(parentID);
    };

    const moveGroupToGroup = (groupID, parentID) => {
        onMoveGroup(groupID, parentID);
    };

    const moveToTrash = groupID => {
        onMoveGroupToTrash(groupID);
        onSelectGroup(null);
    };

    const renderGroupsMenu = (items: Array<GroupTreeNodeInfo>, parentNode: GroupTreeNodeInfo | null, selectedGroupID: GroupID | null) => (
        <>
            {!parentNode && (
                <Fragment>
                    <MenuItem
                        text={t("vault-ui.group-menu.move-to-root")}
                        key="moveRoot"
                        icon="git-pull"
                        onClick={() => moveGroupToGroup(selectedGroupID, "0")}
                        disabled={
                            readOnly ||
                            groupsRaw.find(groupRaw => groupRaw.id === selectedGroupID)?.parentID === "0"
                        }
                    />
                    <MenuDivider />
                </Fragment>
            )}
            {parentNode && (
                <Fragment>
                    <MenuItem
                        text={t("group-menu.move-to-parent", { group: parentNode.label })}
                        key={parentNode.id}
                        icon={parentNode.icon}
                        onClick={() => moveGroupToGroup(selectedGroupID, parentNode.id)}
                        disabled={readOnly || selectedGroupID === parentNode.id}
                    />
                    <MenuDivider />
                </Fragment>
            )}
            {items.map(group => (
                <Fragment>
                    {group.childNodes.length > 0 && (
                        <Fragment>
                            <MenuItem
                                text={group.label}
                                key={group.id}
                                icon={group.icon}
                                onClick={() => moveGroupToGroup(selectedGroupID, group.id)}
                                disabled={readOnly || selectedGroupID === group.id}
                            >
                                {renderGroupsMenu(group.childNodes, group, selectedGroupID)}
                            </MenuItem>
                        </Fragment>
                    ) || (
                        <MenuItem
                            text={group.label}
                            key={group.id}
                            icon={group.icon}
                            onClick={() => moveGroupToGroup(selectedGroupID, group.id)}
                            disabled={readOnly || selectedGroupID === group.id}
                        />
                    )}
                </Fragment>
            ))}
        </>
    );

    const showGroupContextMenu = (node, nodePath, evt) => {
        evt.preventDefault();
        const groupFacade = groupsRaw.find(group => group.id === node.id);
        setGroupsContextOpen(true);
        ContextMenu.show(
            <Menu>
                <MenuItem text={groupFacade?.title} disabled />
                <MenuDivider />
                <MenuItem
                    text={t("vault-ui.group-menu.add-new-group")}
                    icon="add"
                    onClick={() => groupFacade?.id && editGroup(null, groupFacade.id)}
                    disabled={readOnly}
                />
                <MenuItem
                    text={t("vault-ui.group-menu.rename-group")}
                    icon="edit"
                    onClick={() => editGroup(groupFacade)}
                    disabled={readOnly}
                />
                <MenuDivider />
                <MenuItem text={t("vault-ui.group-menu.move-to")} icon="add-to-folder" disabled={readOnly}>
                    {renderGroupsMenu(groups, null, node.id)}
                </MenuItem>
                <MenuItem
                    text={t("vault-ui.group-menu.move-to-trash")}
                    icon="trash"
                    onClick={() => moveToTrash(selectedGroupID)}
                    disabled={readOnly}
                />
            </Menu>,
            { left: evt.clientX, top: evt.clientY },
            () => {
                setGroupsContextOpen(false);
            }
        );
    };

    const submitGroupChange = () => {
        if (groupEditID !== null && groupEditID !== -1) {
            onRenameGroup(groupEditID, newGroupName);
        } else {
            if (!parentGroupID) {
                throw new Error("No parent ID specified");
            }
            onCreateGroup(parentGroupID, newGroupName);
        }
        closeEditDialog();
    };

    return (
        <>
            <PaneContainer primary>
                {!trashOpen && (
                    <Fragment>
                        <PaneHeader
                            title={t("vault-ui.group.header")}
                            count={groups.length}
                            filter={filters}
                            onAddItem={() => editGroup()}
                            onTermChange={term => onGroupFilterTermChange(term)}
                            onSortModeChange={sortMode => onGroupFilterSortModeChange(sortMode)}
                            readOnly={readOnly}
                        />
                        <PaneContent>
                            <Tree
                                contents={groups}
                                onNodeClick={group => onSelectGroup(group.id as string)}
                                onNodeContextMenu={showGroupContextMenu}
                                onNodeExpand={onExpandGroup}
                                onNodeCollapse={onCollapseGroup}
                            />
                        </PaneContent>
                        <PaneFooter>
                            <Button
                                rightIcon={
                                    <Tag
                                        round
                                        minimal
                                        intent={trashCount > 0 ? Intent.WARNING : Intent.NONE}
                                    >
                                        {trashCount}
                                    </Tag>
                                }
                                icon="trash"
                                fill
                                minimal
                                text={t("vault-ui.trash.header")}
                                alignText={Alignment.LEFT}
                                active={trashSelected}
                                onClick={handleTrashClick}
                            />
                        </PaneFooter>
                    </Fragment>
                ) || (
                    <Fragment>
                        <PaneHeader
                            title={t("vault-ui.trash.header")}
                            count={trashGroupCount}
                            filter={filters}
                            onTermChange={term => onGroupFilterTermChange(term)}
                            onSortModeChange={sortMode => onGroupFilterSortModeChange(sortMode)}
                            readOnly={readOnly}
                        />
                        <PaneContent>
                            <Tree
                                contents={trashGroups}
                                onNodeClick={group => onSelectGroup(group.id as string)}
                                onNodeContextMenu={showGroupContextMenu}
                                onNodeExpand={onExpandGroup}
                                onNodeCollapse={onCollapseGroup}
                            />
                        </PaneContent>
                        <PaneFooter>
                            <Button
                                minimal
                                icon="undo"
                                fill
                                text={t("vault-ui.trash.close-button")}
                                onClick={() => setTrashOpen(false)}
                            />
                            <Button
                                icon="delete"
                                minimal
                                title={t("vault-ui.trash.empty-button-title")}
                                alignText={Alignment.LEFT}
                                intent={Intent.DANGER}
                                onClick={() => setEmptyingTrash(true)}
                            />
                        </PaneFooter>
                    </Fragment>
                )}
            </PaneContainer>
            <Dialog
                icon="manually-entered-data"
                onClose={closeEditDialog}
                title={groupEditID === -1 ? t("vault-ui.group.prompt.create") : t("vault-ui.group.prompt.rename")}
                isOpen={groupEditID !== null}
            >
                <div className={Classes.DIALOG_BODY}>
                    <p>{t("vault-ui.group.prompt.message")}</p>
                    <InputGroup
                        leftIcon={groupEditID === -1 ? "folder-new" : "add-to-folder"}
                        onChange={evt => setNewGroupName(evt.target.value)}
                        value={newGroupName}
                        inputRef={groupTitleInputRef}
                        onKeyDown={evt => {
                            if (evt.keyCode === KEYCODE_ENTER) {
                                submitGroupChange();
                            }
                        }}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={closeEditDialog}>{t("vault-ui.group.prompt.cancel")}</Button>
                        <Button intent={Intent.PRIMARY} onClick={submitGroupChange}>
                            {t("vault-ui.group.prompt.save")}
                        </Button>
                    </div>
                </div>
            </Dialog>
            <Dialog
                icon="confirm"
                onClose={closeEditDialog}
                title={t("vault-ui.trash.empty-confirm-dialog.title")}
                isOpen={emptyingTrash}
            >
                <div className={Classes.DIALOG_BODY}>
                    <p>{t("vault-ui.trash.empty-confirm-dialog.message")}</p>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={() => setEmptyingTrash(false)}>
                            {t("vault-ui.trash.empty-confirm-dialog.cancel-button")}
                        </Button>
                        <Button intent={Intent.DANGER} onClick={handleTrashEmpty}>
                            {t("vault-ui.trash.empty-confirm-dialog.confirm-button")}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

