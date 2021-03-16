import * as React from "react";
import { VaultSourceID } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { SearchModal } from "./SearchModal";
import { updateSearchSingleVault } from "../../services/search";
import { SEARCH_RESULTS, SEARCH_VISIBLE } from "../../state/search";

const { useState } = React;

interface SearchManagerProps {
    sourceID?: VaultSourceID;
}

export function SearchManager(props: SearchManagerProps = {}) {
    const { sourceID = null } = props;
    const resultsState = useHookState(SEARCH_RESULTS);
    const visibleState = useHookState(SEARCH_VISIBLE);
    // const [visible, setVisible] = useState(false);
    return (
        <SearchModal
            onClose={() => visibleState.set(false)}
            onSearch={term => {
                if (sourceID) updateSearchSingleVault(sourceID, term);
            }}
            results={resultsState.get()}
            visible={visibleState.get()}
        />
    );
}
