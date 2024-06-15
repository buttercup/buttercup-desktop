import { EntryFacade, EntryPropertyType, VaultFacade, VaultFacadeEntrySearch } from "buttercup";

export const filterEntries = (entries: Array<EntryFacade> = [], term = ""): Array<EntryFacade> => {
    if (term === "") {
        return entries;
    }
    const search = new VaultFacadeEntrySearch([
        {
            id: "-",
            entries
        } as VaultFacade
    ]);
    return search
        .searchByTerm(term)
        .map((item) => entries.find((entry) => entry.id === item.id) as EntryFacade);
};

export function sortEntries(entries: Array<EntryFacade> = [], asc = true) {
    return entries.sort((a, b) => {
        const aTitleProp = a.fields.find(
            (f) => f.property === "title" && f.propertyType === EntryPropertyType.Property
        );
        const bTitleProp = b.fields.find(
            (f) => f.property === "title" && f.propertyType === EntryPropertyType.Property
        );
        const aTitle = aTitleProp?.value ?? "";
        const bTitle = bTitleProp?.value ?? "";
        if (aTitle < bTitle) {
            return asc ? -1 : 1;
        } else if (aTitle > bTitle) {
            return asc ? 1 : -1;
        }
        return 0;
    });
}
