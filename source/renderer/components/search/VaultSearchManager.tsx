import React, { useCallback, useContext } from "react";
import { VaultSourceID, getEntryFacadePath } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { SearchModal } from "./SearchModal";
import { SearchContext } from "./SearchContext";
import { updateSearchSingleVault } from "../../services/search";
import { SEARCH_RESULTS, SEARCH_VISIBLE } from "../../state/search";
import { useCurrentFacade } from "../../hooks/facade";
import { logErr } from "../../library/log";

interface SearchManagerProps {
    sourceID?: VaultSourceID;
}

export function VaultSearchManager(props: SearchManagerProps = {}) {
    const { sourceID = null } = props;
    const resultsState = useHookState(SEARCH_RESULTS);
    const visibleState = useHookState(SEARCH_VISIBLE);
    const currentFacade = useCurrentFacade();
    const {
        setSelectedEntryID,
        setSelectedGroupID
    } = useContext(SearchContext);
    const handleSearchResultSelection = useCallback(res => {
        const entryID = res.result?.id ?? null;
        if (!entryID) {
            logErr("Search result was invalid when selected");
            return;
        }
        visibleState.set(false);
        try {
            const groupPath = getEntryFacadePath(entryID, currentFacade);
            const groupID = groupPath[groupPath.length - 1];
            setSelectedGroupID(groupID);
            setSelectedEntryID(entryID);
        } catch (err) {
            logErr("Failed applying search result to vault navigation", err);
        }
    }, [currentFacade]);
    return (
        <SearchModal
            onClose={() => visibleState.set(false)}
            onSearch={term => {
                if (sourceID) updateSearchSingleVault(sourceID, term);
            }}
            onSelect={handleSearchResultSelection}
            results={resultsState.get()}
            visible={visibleState.get()}
        />
    );
}
