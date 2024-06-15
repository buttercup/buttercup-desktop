export * from "../shared/types";

export enum EntriesSortMode {
    AlphaASC = "az",
    AlphaDESC = "za",
    Filter = "filter"
}

export interface NewVaultPlaceholder {
    filename: string;
    parentIdentifier: string | number | null;
}

export enum Theme {
    Dark = "dark",
    Light = "light"
}
