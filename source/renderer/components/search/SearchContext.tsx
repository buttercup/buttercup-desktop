import { EntryID, GroupID } from "buttercup";
import React, { createContext, useCallback, useState } from "react";

interface SearchContextState {
    resetSelection: () => void;
    selectedEntryID: EntryID | null;
    selectedGroupID: GroupID | null;
    setSelectedEntryID: (id: EntryID | null) => void;
    setSelectedGroupID: (id: GroupID | null) => void;
}

export const SearchContext = createContext<SearchContextState>({} as SearchContextState);

export function SearchProvider(props) {
    const { children } = props;
    const [selectedGroupID, setSelectedGroupID] = useState<GroupID | null>(null);
    const [selectedEntryID, setSelectedEntryID] = useState<EntryID | null>(null);
    const resetSelection = useCallback(() => {
        setSelectedEntryID(null);
        setSelectedGroupID(null);
    }, []);
    const context: SearchContextState = {
        resetSelection,
        selectedEntryID,
        selectedGroupID,
        setSelectedEntryID,
        setSelectedGroupID
    };
    return (
        <SearchContext.Provider value={context}>
            {children}
        </SearchContext.Provider>
    );
}
