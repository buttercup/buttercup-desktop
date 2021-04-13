import { SearchResult as CoreSearchResult, VaultSourceID, VaultSourceStatus } from "buttercup";

export interface AddVaultPayload {
    createNew: boolean;
    datasourceConfig: DatasourceConfig;
    masterPassword: string;
    fileNameOverride?: string;
}

export interface AppEnvironmentFlags {
    portable: boolean;
}

export type DatasourceConfig = { [key: string]: string } & { type: SourceType };

export interface Language {
    name: string;
    slug: string;
}

export enum LogLevel {
    Error = "error",
    Info = "info",
    Warning = "warning"
}

export interface Preferences {
    autoClearClipboard: false | number;
    fileHostEnabled: boolean;
    language: null | string;
    lockVaultsAfterTime: false | number;
    lockVaultsOnWindowClose: boolean;
    uiTheme: ThemeSource;
}

export interface SearchResult {
    type: "entry";
    result: CoreSearchResult;
}

export enum SourceType {
    Dropbox = "dropbox",
    File = "file",
    GoogleDrive = "googledrive",
    WebDAV = "webdav"
}

export enum ThemeSource {
    System = "system",
    Dark = "dark",
    Light = "light"
}

export interface UpdateProgressInfo {
    bytesPerSecond: number;
    percent: number;
    total: number;
    transferred: number;
}

export interface VaultSourceDescription {
    id: VaultSourceID;
    name: string;
    state: VaultSourceStatus;
    type: SourceType;
}
