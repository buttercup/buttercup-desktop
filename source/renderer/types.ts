export * from "../shared/types";

export interface NewVaultPlaceholder {
    filename: string;
    parentIdentifier: string | null;
}

export enum Theme {
    Dark = "dark",
    Light = "light"
}
