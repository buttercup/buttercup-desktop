import { VaultSourceID, VaultSourceStatus } from "buttercup";

export interface AddVaultPayload {
    existing: boolean;
    filename?: string;
    masterPassword: string;
    type: SourceType;
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
