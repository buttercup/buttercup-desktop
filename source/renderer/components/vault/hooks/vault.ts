import { useCallback, useContext, useMemo } from "react";
import { EntryFacade, EntryID, GroupFacade, GroupID } from "buttercup";
import { VaultContext, VaultContextState } from "../VaultContext";
import {
    countChildGroups,
    countChildGroupsAndEntries,
    filterNestedGroups,
    getAllEntriesInGroup,
    getAllGroupsInGroup,
    getNestedGroups,
    isTrashGroup,
    sortGroups
} from "../utils/groups";
import { filterEntries, sortEntries } from "../utils/entries";
import { FilterState } from "../reducers/vault";
import { EntriesSortMode, UpdatedEntryFacade } from "../../../types";
import { GroupTreeNodeInfo } from "../types";

type ActionsResult = Pick<VaultContextState, "onAddEntry">;

type CurrentEntriesResult = Pick<
    VaultContextState,
    | "onEntriesFilterSortModeChange"
    | "onEntriesFilterTermChange"
    | "onSelectEntry"
    | "selectedEntryID"
> & {
    entries: Array<EntryFacade>;
    filters: FilterState;
};

type CurrentEntryResult = Pick<
    VaultContextState,
    | "onAddField"
    | "onCancelEdit"
    | "onDeleteEntry"
    | "onEdit"
    | "onFieldNameUpdate"
    | "onFieldSetValueType"
    | "onFieldUpdateInPlace"
    | "onFieldUpdate"
    | "onRemoveField"
    | "onSaveEdit"
> & {
    editing: boolean;
    entry: UpdatedEntryFacade | null;
};

type GroupsResult = Pick<
    VaultContextState,
    | "expandedGroups"
    | "onCollapseGroup"
    | "onCreateGroup"
    | "onExpandGroup"
    | "onGroupFilterSortModeChange"
    | "onGroupFilterTermChange"
    | "onMoveEntryToGroup"
    | "onMoveGroup"
    | "onRenameGroup"
    | "onSelectGroup"
> & {
    emptyTrash: () => void;
    filters: FilterState;
    groups: Array<GroupTreeNodeInfo>;
    groupsRaw: Array<GroupFacade>;
    onMoveEntryToTrash: (entryID: EntryID) => void;
    onMoveGroupToTrash: (groupID: GroupID) => void;
    selectedGroupID: GroupID | null;
    trashCount: number;
    trashGroupCount: number;
    trashGroups: Array<GroupTreeNodeInfo>;
    trashID: GroupID | null;
    trashSelected: boolean;
};

export function useCurrentEntry(): CurrentEntryResult {
    const {
        editingEntry,
        selectedEntry,
        onDeleteEntry,
        onAddField,
        onCancelEdit,
        onEdit,
        onFieldNameUpdate,
        onFieldUpdate,
        onFieldUpdateInPlace,
        onFieldSetValueType,
        onRemoveField,
        onSaveEdit
    } = useContext(VaultContext);

    return {
        entry: editingEntry || selectedEntry,
        editing: Boolean(editingEntry),
        onDeleteEntry,
        onAddField,
        onCancelEdit,
        onEdit,
        onFieldNameUpdate,
        onFieldUpdate,
        onFieldUpdateInPlace,
        onFieldSetValueType,
        onRemoveField,
        onSaveEdit
    };
}

export function useCurrentEntries(): CurrentEntriesResult {
    const {
        currentEntries,
        onSelectEntry,
        selectedEntryID,
        entriesFilters,
        onEntriesFilterTermChange,
        onEntriesFilterSortModeChange
    } = useContext(VaultContext);
    const { sortMode } = entriesFilters;
    const entries =
        sortMode === EntriesSortMode.Filter
            ? currentEntries
            : sortEntries(currentEntries, sortMode === EntriesSortMode.AlphaASC);

    return {
        entries: filterEntries(entries, entriesFilters.term),
        onSelectEntry,
        selectedEntryID,
        filters: entriesFilters,
        onEntriesFilterTermChange,
        onEntriesFilterSortModeChange
    };
}

export function useGroups(): GroupsResult {
    const {
        batchDeleteItems,
        expandedGroups,
        groupFilters,
        onCollapseGroup,
        onCreateGroup,
        onExpandGroup,
        onGroupFilterSortModeChange,
        onGroupFilterTermChange,
        onMoveEntryToGroup,
        onMoveGroup,
        onRenameGroup,
        onSelectGroup,
        selectedGroupID,
        vault
    } = useContext(VaultContext);

    const trashGroup = useMemo(() => vault.groups.find(isTrashGroup), [vault]);
    const trashID = useMemo(() => (trashGroup && trashGroup.id) || null, [trashGroup]);
    const trashSelected = selectedGroupID === trashID;
    const trashCount = useMemo(
        () => (trashID ? countChildGroupsAndEntries(vault, trashID) : 0),
        [vault, trashID]
    );
    const trashGroupCount = useMemo(
        () => (trashID ? countChildGroups(vault, trashID) : 0),
        [vault, trashID]
    );
    const onMoveEntryToTrash = useCallback(
        (entryID: EntryID) => {
            if (!trashID) {
                throw new Error("No trash group available");
            }
            onMoveEntryToGroup(entryID, trashID);
        },
        [trashID]
    );
    const emptyTrash = useCallback(() => {
        if (!trashID) return;
        const trashEntries = getAllEntriesInGroup(vault, trashID);
        const trashGroups = getAllGroupsInGroup(vault, trashID);
        batchDeleteItems({
            groupIDs: trashGroups.map((group) => group.id as string),
            entryIDs: trashEntries.map((entry) => entry.id)
        });
    }, [vault, batchDeleteItems, trashID]);

    return {
        groups: filterNestedGroups(
            getNestedGroups(
                sortGroups(vault.groups, groupFilters.sortMode === "az"),
                selectedGroupID,
                expandedGroups
            ),
            groupFilters.term
        ),
        groupsRaw: vault.groups,
        emptyTrash,
        filters: groupFilters,
        onCreateGroup,
        onGroupFilterTermChange,
        onGroupFilterSortModeChange,
        onMoveGroup,
        onMoveGroupToTrash: (groupID) => {
            if (!trashID) {
                console.error("No trash group found");
                return;
            }
            return onMoveGroup(groupID, trashID);
        },
        onRenameGroup,
        onSelectGroup,
        selectedGroupID,
        expandedGroups,
        onCollapseGroup,
        onExpandGroup,
        onMoveEntryToGroup,
        onMoveEntryToTrash,
        trashGroups: trashGroup
            ? filterNestedGroups(
                  getNestedGroups(
                      sortGroups(vault.groups, groupFilters.sortMode === "az"),
                      selectedGroupID,
                      expandedGroups,
                      trashID ?? undefined,
                      true // allow trash
                  ),
                  groupFilters.term
              )
            : [],
        trashID,
        trashSelected,
        trashCount,
        trashGroupCount
    };
}

export function useActions(): ActionsResult {
    const { onAddEntry } = useContext(VaultContext);
    return {
        onAddEntry
    };
}
