import { VaultSourceID, VaultSourceStatus } from "buttercup";

export interface AddVaultPayload {
    createNew: boolean;
    datasourceConfig: DatasourceConfig;
    masterPassword: string;
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
    language: null | string;
    lockVaultsAfterTime: false | number;
    lockVaultsOnWindowClose: boolean;
}

export enum SourceType {
    Dropbox = "dropbox",
    File = "file",
    GoogleDrive = "googledrive",
    WebDAV = "webdav"
}

export interface VaultSourceDescription {
    id: VaultSourceID;
    name: string;
    state: VaultSourceStatus;
    type: SourceType;
}
