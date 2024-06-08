import {
    EntryFacade,
    EntryFacadeField,
    EntryPropertyType,
    EntryPropertyValueType,
    createFieldDescriptor
} from "buttercup";
import { UpdatedEntryFacade } from "../../../types";

export enum EntryActionType {
    AddField = "add-field",
    RemoveField = "remove-field",
    SetEntry = "set-entry",
    SetFieldValueType = "set-field-value-type",
    StopEditing = "stop-editing",
    UpdateField = "update-field"
}

type EntryAction =
    | {
          type: EntryActionType.AddField;
      }
    | {
          field: EntryFacadeField;
          type: EntryActionType.RemoveField;
      }
    | {
          payload: EntryFacade;
          type: EntryActionType.SetEntry;
      }
    | {
          field: EntryFacadeField;
          type: EntryActionType.SetFieldValueType;
          valueType: EntryPropertyValueType;
      }
    | {
          type: EntryActionType.StopEditing;
      }
    | {
          field: EntryFacadeField;
          property?: string;
          type: EntryActionType.UpdateField;
          value?: string;
      };

interface EntryState {
    entry: UpdatedEntryFacade | null;
}

export function entryReducer(state: EntryState, action: EntryAction): EntryState {
    // return state;
    switch (action.type) {
        case EntryActionType.AddField: {
            const field = createFieldDescriptor(null, "", EntryPropertyType.Property, "", {
                removeable: true
            });
            if (!state.entry) {
                throw new Error("No entry in edit state");
            }
            return {
                ...state,
                entry: {
                    ...state.entry,
                    fields: [...state.entry.fields, field]
                }
            };
        }
        case EntryActionType.RemoveField:
            if (!state.entry) {
                throw new Error("No entry in edit state");
            }
            return {
                ...state,
                entry: {
                    ...state.entry,
                    fields: state.entry.fields.filter((field) => field.id !== action.field.id)
                }
            };
        case EntryActionType.SetEntry:
            return {
                ...state,
                entry: action.payload
            };
        case EntryActionType.SetFieldValueType: {
            if (!state.entry) {
                throw new Error("No entry in edit state");
            }
            const { field: changedField, valueType } = action;
            return {
                ...state,
                entry: {
                    ...state.entry,
                    fields: state.entry.fields.map((field) => {
                        if (field.id === changedField.id) {
                            return { ...field, valueType };
                        }
                        return field;
                    })
                }
            };
        }
        case EntryActionType.StopEditing:
            return {
                ...state,
                entry: null
            };
        case EntryActionType.UpdateField: {
            if (!state.entry) {
                throw new Error("No entry in edit state");
            }
            const { field: changedField, value, property } = action;
            return {
                ...state,
                entry: {
                    ...state.entry,
                    fields: state.entry.fields.map((field) => {
                        if (field.id === changedField.id) {
                            const newValue = typeof value === "string" ? value : field.value;
                            const newProperty =
                                typeof property === "string" ? property : field.property;
                            return { ...field, value: newValue, property: newProperty };
                        }
                        return field;
                    })
                }
            };
        }
        default:
            throw new Error("Bad entry state");
    }
}

export function getInitialEntryState(): EntryState {
    return {
        entry: null
    };
}
