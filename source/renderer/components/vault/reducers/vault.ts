import { EntryFacadeField, EntryID, GroupFacade, GroupID, VaultFacade } from "buttercup";
import { EntriesSortMode, UpdatedEntryFacade } from "../../../types";

export interface FilterState {
    term: string;
    sortMode: EntriesSortMode;
}

export enum FilterActionType {
    SetSortMode = "set-sort-mode",
    SetTerm = "set-term"
}

export type FilterAction =
    | {
          sortMode: EntriesSortMode;
          type: FilterActionType.SetSortMode;
      }
    | {
          term: string;
          type: FilterActionType.SetTerm;
      };

export enum VaultStateActionType {
    BatchDelete = "batch-delete",
    CreateGroup = "create-group",
    DeleteEntry = "delete-entry",
    MoveEntry = "move-entry",
    MoveGroup = "move-group",
    RenameGroup = "rename-group",
    Reset = "reset",
    SaveEntry = "save-entry",
    SetEntryField = "set-entry-field"
}

export type VaultStateAction =
    | {
          entries: Array<EntryID>;
          groups: Array<GroupID>;
          type: VaultStateActionType.BatchDelete;
      }
    | {
          payload: GroupFacade;
          type: VaultStateActionType.CreateGroup;
      }
    | {
          entryID: EntryID;
          type: VaultStateActionType.DeleteEntry;
      }
    | {
          entryID: EntryID;
          parentID: GroupID;
          type: VaultStateActionType.MoveEntry;
      }
    | {
          groupID: GroupID;
          parentID: GroupID;
          type: VaultStateActionType.MoveGroup;
      }
    | {
          groupID: GroupID;
          title: string;
          type: VaultStateActionType.RenameGroup;
      }
    | {
          payload: VaultFacade;
          type: VaultStateActionType.Reset;
      }
    | {
          entry: UpdatedEntryFacade;
          type: VaultStateActionType.SaveEntry;
      }
    | {
          entryID: EntryID;
          field: EntryFacadeField;
          value: string;
          type: VaultStateActionType.SetEntryField;
      };

interface VaultState extends VaultFacade {
    _tag: any;
}

const FLAG_VAULT_UPDATED = { _tag: null };

export function vaultReducer(state: VaultState, action: VaultStateAction): VaultState {
    switch (action.type) {
        case VaultStateActionType.Reset:
            return {
                ...action.payload
            };
        case VaultStateActionType.SaveEntry: {
            const { entry: baseEntry } = action;
            const { isNew, ...entry } = baseEntry;
            const existingEntry = state.entries.find((e) => e.id === entry.id);
            if (existingEntry) {
                return {
                    ...state,
                    ...FLAG_VAULT_UPDATED,
                    entries: state.entries.map((e) => {
                        if (e.id === entry.id) {
                            return entry;
                        }
                        return e;
                    })
                };
            }
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                entries: [...state.entries, entry]
            };
        }
        case VaultStateActionType.MoveEntry:
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                entries: state.entries.map((entry) => {
                    if (entry.id === action.entryID) {
                        return {
                            ...entry,
                            parentID: action.parentID
                        };
                    }
                    return entry;
                })
            };
        case VaultStateActionType.DeleteEntry:
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                entries: state.entries.filter((entry) => entry.id !== action.entryID)
            };
        case VaultStateActionType.CreateGroup:
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                groups: [...state.groups, action.payload]
            };
        case VaultStateActionType.SetEntryField: {
            const { entryID, field, value } = action;
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                entries: state.entries.map((entry) => {
                    if (entry.id === entryID) {
                        return {
                            ...entry,
                            fields: entry.fields.map((entryField) => {
                                if (
                                    entryField.property === field.property &&
                                    entryField.propertyType === field.propertyType
                                ) {
                                    return {
                                        ...entryField,
                                        value: value
                                    };
                                }
                                return entryField;
                            })
                        };
                    }
                    return entry;
                })
            };
        }
        case VaultStateActionType.RenameGroup:
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                groups: state.groups.map((group) => {
                    if (group.id === action.groupID) {
                        return {
                            ...group,
                            title: action.title
                        };
                    }
                    return group;
                })
            };
        case VaultStateActionType.MoveGroup:
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                groups: state.groups.map((group) => {
                    if (group.id === action.groupID) {
                        return {
                            ...group,
                            parentID: action.parentID
                        };
                    }
                    return group;
                })
            };
        case VaultStateActionType.BatchDelete:
            return {
                ...state,
                ...FLAG_VAULT_UPDATED,
                groups: state.groups.filter(
                    (group) => action.groups.includes(group.id as string) === false
                ),
                entries: state.entries.filter(
                    (entry) => action.entries.includes(entry.id) === false
                )
            };
        default:
            throw new Error("Bad state init");
    }
}

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case FilterActionType.SetTerm:
            return {
                ...state,
                term: action.term
            };
        case FilterActionType.SetSortMode:
            return {
                ...state,
                sortMode: action.sortMode
            };
    }
}

export function getDefaultFilterState(): FilterState {
    return {
        term: "",
        sortMode: EntriesSortMode.AlphaASC
    };
}
