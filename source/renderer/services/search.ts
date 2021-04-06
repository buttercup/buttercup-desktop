import { ipcRenderer } from "electron";
import debounce from "debounce";
import { VaultSourceID } from "buttercup";
import { setSearchResults } from "../state/search";
import { SearchResult } from "../types";

const __deb_searchSingleVault = debounce(__searchSingleVault, 200, /* immediate: */ false);

async function __searchSingleVault(sourceID: VaultSourceID, term: string) {
    const results: Array<SearchResult> = await ipcRenderer.invoke(
        "search-single-vault",
        sourceID,
        term
    );
    setSearchResults(results);
}

export function updateSearchSingleVault(sourceID: VaultSourceID, term: string): void {
    __deb_searchSingleVault(sourceID, term);
}
