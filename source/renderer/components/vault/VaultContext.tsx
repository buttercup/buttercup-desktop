import React, { createContext, useMemo, useState } from "react";
import { useReducer } from "use-reducer-state";
import { EntryFacade, EntryFacadeField, EntryID, EntryPropertyValueType, EntryType, GroupFacade, GroupID, VaultFacade, createEntryFacade, createGroupFacade } from "buttercup";
import { EntryActionType, entryReducer, getInitialEntryState } from "./reducers/entry";
import { FilterState, vaultReducer, filterReducer, getDefaultFilterState, VaultStateActionType, FilterActionType } from "./reducers/vault";
import { useDeepEffect } from "./hooks/compare";
import { naiveClone } from "../../../shared/library/clone";
import { EntriesSortMode, UpdatedEntryFacade } from "../../types";
import { GroupTreeNodeInfo } from "./types";

export interface VaultContextState {
    vault: VaultFacade;
    currentEntries: Array<EntryFacade>;
    selectedEntry: UpdatedEntryFacade | null;
    editingEntry: UpdatedEntryFacade | null;
    selectedEntryID: EntryID | null;
    selectedGroupID: GroupID | null;
    expandedGroups: Array<GroupID>;
    groupFilters: FilterState;
    entriesFilters: FilterState;
    onUserCopy: ((text: string) => void) | null;

    // Attachments
    attachments: boolean;
    attachmentsMaxSize: number;
    attachmentPreviews: Record<string, string>;
    onAddAttachments: (entryID: EntryID, files: Array<File>) => Promise<void>;
    onDeleteAttachment: (entryID: EntryID, attachmentID: string) => Promise<void>;
    onDownloadAttachment: (entryID: EntryID, attachmentID: string) => Promise<void>;
    onPreviewAttachment: (entryID: EntryID, attachmentID: string) => Promise<void>;

    // Icons
    iconsEnabled: boolean;

    // Editing
    readOnly: boolean;

    batchDeleteItems: (action: { groupIDs?: Array<GroupID>; entryIDs?: Array<EntryID>; }) => void;
    onCollapseGroup: (group: GroupTreeNodeInfo) => void;
    onCreateGroup: (parentID: GroupID, groupTitle: string) => void;
    onExpandGroup: (group: GroupTreeNodeInfo) => void;
    onSelectGroup: (groupID: GroupID | null) => void;
    onGroupFilterTermChange: (term: string) => void;
    onGroupFilterSortModeChange: (sortMode: EntriesSortMode) => void;
    onEntriesFilterTermChange: (term: string) => void;
    onEntriesFilterSortModeChange: (sortMode: EntriesSortMode) => void;
    onMoveEntryToGroup: (entryID: EntryID, parentID: GroupID) => void;
    onMoveGroup: (groupID: GroupID, parentID: GroupID) => void;
    onRenameGroup: (groupID: GroupID, title: string) => void;
    onAddEntry: (type: EntryType) => void;
    onDeleteEntry: (entryID: EntryID) => void;
    onEdit: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onSelectEntry: (entryID: EntryID) => void;
    onAddField: () => void;
    onFieldUpdate: (changedField: EntryFacadeField, value: string) => void;
    onFieldUpdateInPlace: (entryID: EntryID, field: EntryFacadeField, value: string) => void;
    onFieldSetValueType: (changedField: EntryFacadeField, valueType: EntryPropertyValueType) => void;
    onFieldNameUpdate: (changedField: EntryFacadeField, property: string) => void;
    onRemoveField: (field: EntryFacadeField) => void;
}

export interface VaultProviderProps {
    attachments: boolean;
    attachmentsMaxSize?: number;
    attachmentPreviews?: Record<string, string> | null,
    children?: React.ReactNode;
    icons?: boolean;
    onAddAttachments: (entryID: EntryID, files: Array<File>) => Promise<void>;
    onDeleteAttachment: (entryID: EntryID, attachmentID: string) => Promise<void>;
    onDownloadAttachment: (entryID: EntryID, attachmentID: string) => Promise<void>;
    onEditing?: (editing: boolean) => void;
    onPreviewAttachment: (entryID: EntryID, attachmentID: string) => Promise<void>;
    onSelectEntry: ((id: string | null) => void) | null;
    onSelectGroup: ((id: string | null) => void) | null;
    onUpdate: (facade: VaultFacade) => void;
    onUserCopy?: ((text: string) => void) | null;
    readOnly?: boolean;
    selectedEntry?: string | null;
    selectedGroup?: string | null;
    vault: VaultFacade;
}

const NOOP = () => {};

export const VaultContext = createContext<VaultContextState>({} as VaultContextState);

export const VaultProvider = ({
    attachments,
    attachmentsMaxSize = Infinity,
    attachmentPreviews = null,
    icons = false,
    onAddAttachments,
    onDeleteAttachment,
    onDownloadAttachment,
    onEditing = NOOP,
    onPreviewAttachment,
    onSelectEntry = null,
    onSelectGroup = null,
    onUpdate,
    onUserCopy = null,
    readOnly = false,
    selectedEntry: extSelectedEntry = null,
    selectedGroup: extSelectedGroup = null,
    vault: vaultSource,
    children
}: VaultProviderProps) => {
    const attachmentPreviewsRef = useMemo(() => attachmentPreviews === null ? {} : attachmentPreviews, [attachmentPreviews]);
    const { _tag: vaultFacadeTag } = vaultSource;
    const [vaultState, dispatch] = useReducer(vaultReducer, () => vaultSource);
    const [lastVaultFacadeTag, setLastVaultFacadeTag] = useState(vaultFacadeTag);
    const [editingEntryState, dispatchEditing] = useReducer(entryReducer, getInitialEntryState);
    const [groupFiltersState, dispatchGroupFilters] = useReducer(filterReducer, getDefaultFilterState);
    const [entriesFiltersState, dispatchEntriesFilters] = useReducer(filterReducer, getDefaultFilterState);
    const [expandedGroups, setExpandedGroups] = useState<Array<GroupID>>([]);

    const [__selectedGroupID, __setSelectedGroupID] = useState<GroupID | null>(vaultState.groups[0].id);
    const [__selectedEntryID, __setSelectedEntryID] = useState<EntryID | null>(null);
    const [setSelectedEntryID, setSelectedGroupID] = useMemo(
        () =>
            onSelectEntry && onSelectGroup
                ? [onSelectEntry, onSelectGroup]
                : [__setSelectedEntryID, __setSelectedGroupID],
        [onSelectEntry, onSelectGroup, __setSelectedGroupID, __setSelectedEntryID]
    );
    const [selectedEntryID, selectedGroupID] = useMemo(
        () =>
            onSelectEntry && onSelectGroup
                ? [extSelectedEntry, extSelectedGroup]
                : [__selectedEntryID, __selectedGroupID],
        [
            onSelectEntry,
            onSelectGroup,
            extSelectedEntry,
            extSelectedGroup,
            __selectedEntryID,
            __selectedGroupID
        ]
    );

    const selectedEntry = vaultState.entries.find(entry => entry.id === selectedEntryID) ?? null;
    const currentEntries = vaultState.entries.filter(entry => entry.parentID === selectedGroupID);

    useDeepEffect(() => {
        if (vaultFacadeTag !== lastVaultFacadeTag) {
            // External updated, update internal state
            dispatch({
                type: VaultStateActionType.Reset,
                payload: vaultSource
            });
            setLastVaultFacadeTag(vaultFacadeTag);
        } else if (vaultState._tag === null) {
            // Internal updated, fire update event for external save
            onUpdate(vaultState);
        }
    }, [vaultState, vaultFacadeTag]);

    const context = {
        vault: vaultState,
        currentEntries,
        selectedEntry,
        editingEntry: editingEntryState.entry,
        selectedEntryID,
        selectedGroupID,
        expandedGroups,
        groupFilters: groupFiltersState,
        entriesFilters: entriesFiltersState,

        // Attachments
        attachments,
        attachmentsMaxSize,
        attachmentPreviews: attachmentPreviewsRef,
        onAddAttachments,
        onDeleteAttachment,
        onDownloadAttachment,
        onPreviewAttachment,

        // Icons
        iconsEnabled: icons,

        // Editing
        readOnly,

        // Actions
        batchDeleteItems: ({ groupIDs = [], entryIDs = [] }) => {
            dispatch({
                type: VaultStateActionType.BatchDelete,
                groups: groupIDs,
                entries: entryIDs
            });
        },
        onSelectGroup: groupID => {
            setSelectedEntryID(null);
            setSelectedGroupID(groupID);
        },
        onExpandGroup: (group: GroupTreeNodeInfo) => {
            setExpandedGroups([...expandedGroups, group.id] as Array<GroupID>);
        },
        onCollapseGroup: (group: GroupTreeNodeInfo) => {
            setExpandedGroups(expandedGroups.filter(id => id !== group.id));
        },
        onCreateGroup: (parentID, groupTitle) => {
            const parentGroupID = parentID ? parentID : undefined;
            const group = createGroupFacade(null, parentGroupID);
            group.title = groupTitle;
            dispatch({
                type: VaultStateActionType.CreateGroup,
                payload: group
            });
        },
        onGroupFilterTermChange: term => {
            dispatchGroupFilters({
                type: FilterActionType.SetTerm,
                term
            });
        },
        onGroupFilterSortModeChange: sortMode => {
            dispatchGroupFilters({
                type: FilterActionType.SetSortMode,
                sortMode
            });
        },
        onEntriesFilterTermChange: term => {
            dispatchEntriesFilters({
                type: FilterActionType.SetTerm,
                term
            });
        },
        onEntriesFilterSortModeChange: sortMode => {
            dispatchEntriesFilters({
                type: FilterActionType.SetSortMode,
                sortMode
            });
        },
        onMoveEntryToGroup: (entryID, parentID) => {
            dispatch({
                type: VaultStateActionType.MoveEntry,
                entryID,
                parentID
            });
            if (editingEntryState.entry && entryID === editingEntryState.entry.id) {
                dispatchEditing({
                    type: EntryActionType.StopEditing
                });
            }
        },
        onMoveGroup: (groupID, parentID) => {
            dispatch({
                type: VaultStateActionType.MoveGroup,
                groupID,
                parentID
            });
        },
        onRenameGroup: (groupID, title) => {
            dispatch({
                type: VaultStateActionType.RenameGroup,
                groupID,
                title
            });
        },
        onUserCopy,
        onAddEntry: (type: EntryType) => {
            const facade: UpdatedEntryFacade = createEntryFacade(undefined, { type });
            if (!selectedGroupID) {
                throw new Error("No group selected");
            }
            facade.parentID = selectedGroupID;
            facade.isNew = true;
            dispatchEditing({
                type: EntryActionType.SetEntry,
                payload: facade
            });
            setSelectedEntryID(null);
        },
        onDeleteEntry: (entryID: EntryID) => {
            dispatch({
                type: VaultStateActionType.DeleteEntry,
                entryID
            });
            dispatchEditing({
                type: EntryActionType.StopEditing
            });
        },
        onEdit: () => {
            if (!selectedEntry) {
                return;
            }
            dispatchEditing({
                type: EntryActionType.SetEntry,
                payload: naiveClone(selectedEntry)
            });
            setSelectedEntryID(null);
            onEditing(true);
        },
        onSaveEdit: () => {
            if (!editingEntryState.entry) {
                return;
            }
            dispatch({
                type: VaultStateActionType.SaveEntry,
                entry: editingEntryState.entry
            });
            dispatchEditing({
                type: EntryActionType.StopEditing
            });
            onEditing(false);
            if (editingEntryState.entry.id) {
                setSelectedEntryID(editingEntryState.entry.id);
            }
        },
        onCancelEdit: () => {
            dispatchEditing({
                type: EntryActionType.StopEditing
            });
            onEditing(false);
            if (editingEntryState.entry?.id) {
                setSelectedEntryID(editingEntryState.entry.id);
            }
        },
        onSelectEntry: (entryID: EntryID) => {
            if (editingEntryState.entry) {
                return;
            }
            setSelectedEntryID(entryID);
        },
        onAddField: () => {
            dispatchEditing({
                type: EntryActionType.AddField,
            });
        },
        onFieldUpdate: (changedField: EntryFacadeField, value: string) => {
            dispatchEditing({
                type: EntryActionType.UpdateField,
                field: changedField,
                value
            });
        },
        onFieldUpdateInPlace: (entryID: EntryID, field: EntryFacadeField, value: string) => {
            dispatch({
                type: VaultStateActionType.SetEntryField,
                entryID,
                field,
                value
            });
        },
        onFieldSetValueType: (changedField: EntryFacadeField, valueType: EntryPropertyValueType) => {
            dispatchEditing({
                type: EntryActionType.SetFieldValueType,
                field: changedField,
                valueType
            });
        },
        onFieldNameUpdate: (changedField: EntryFacadeField, property: string) => {
            dispatchEditing({
                type: EntryActionType.UpdateField,
                field: changedField,
                property
            });
        },
        onRemoveField: (field: EntryFacadeField) => {
            dispatchEditing({
                type: EntryActionType.RemoveField,
                field
            });
        }
    } satisfies VaultContextState;
    return <VaultContext.Provider value={context}>{children}</VaultContext.Provider>;
};
