import {
    SearchResult as CoreSearchResult,
    VaultEntrySearch,
    VaultSource,
    VaultSourceID
} from "buttercup";
import { logInfo } from "../library/log";

interface SearchCache {
    [sourceID: string]: VaultEntrySearch;
}

let __primarySearch: VaultEntrySearch = null;
const __searchCache: SearchCache = {};

export async function searchAllVaults(term: string): Promise<Array<CoreSearchResult>> {
    if (!__primarySearch) return [];
    return __primarySearch.searchByTerm(term);
}

export async function searchSingleVault(
    sourceID: VaultSourceID,
    term: string
): Promise<Array<CoreSearchResult>> {
    const search = __searchCache[sourceID];
    if (!search) return [];
    return search.searchByTerm(term);
}

export async function updateSearchCaches(unlockedSources: Array<VaultSource>) {
    const missingVaults = Object.keys(__searchCache).filter(
        (sourceID) => !unlockedSources.find((source) => source.id === sourceID)
    );
    for (const missing of missingVaults) {
        delete __searchCache[missing];
    }
    for (const source of unlockedSources) {
        __searchCache[source.id] = __searchCache[source.id] || new VaultEntrySearch([source.vault]);
    }
    __primarySearch = new VaultEntrySearch(unlockedSources.map((source) => source.vault));
    await Promise.all([
        __primarySearch.prepare(),
        ...Object.keys(__searchCache).map(async (sourceID) => {
            logInfo(`Update search record for vault: ${sourceID}`);
            await __searchCache[sourceID].prepare();
        })
    ]);
    logInfo(`Updated search records for ${unlockedSources.length} vaults`);
}
