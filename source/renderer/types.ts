export * from "../shared/types";

export interface NewVaultPlaceholder {
    filename: string;
    parentIdentifier: string | number | null;
}

export enum Theme {
    Dark = "dark",
    Light = "light"
}
