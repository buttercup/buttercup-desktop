import React, { useCallback, useState } from "react";

export const SearchContext = React.createContext(null);

export function SearchProvider(props) {
    const { children } = props;
    const [selectedGroupID, setSelectedGroupID] = useState(null);
    const [selectedEntryID, setSelectedEntryID] = useState(null);
    const resetSelection = useCallback(() => {
        setSelectedEntryID(null);
        setSelectedGroupID(null);
    }, []);
    const context = {
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
