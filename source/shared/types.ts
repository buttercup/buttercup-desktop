import { VaultSourceID, VaultSourceStatus } from "buttercup";

export interface AddVaultPayload {
    createNew: boolean;
    datasourceConfig: DatasourceConfig;
    masterPassword: string;
}

export type DatasourceConfig = { [key: string]: string } & { type: SourceType };

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
