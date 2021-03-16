import { State, createState } from "@hookstate/core";
import { SearchResult } from "../types";

export const SEARCH_RESULTS: State<Array<SearchResult>> = createState([] as Array<SearchResult>);
export const SEARCH_VISIBLE: State<boolean> = createState(false as boolean);

export function setSearchResults(results: Array<SearchResult>) {
    SEARCH_RESULTS.set([...results]);
}

export function setSearchVisible(visible: boolean) {
    SEARCH_VISIBLE.set(visible);
}
