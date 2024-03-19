import {
    DropboxInterface,
    FileSystemInterface,
    GoogleDriveInterface,
    WebDAVInterface
} from "@buttercup/file-interface";
import { GoogleDriveClient } from "@buttercup/googledrive-client";
import { DropboxClient } from "@buttercup/dropbox-client";
import { AuthType, createClient as createWebdavClient } from "webdav";
import { SourceType } from "../types";

export interface FSInstanceSettings {
    endpoint?: string;
    password?: string;
    token?: string;
    username?: string;
}

export function getFSInstance(type: SourceType, settings: FSInstanceSettings): FileSystemInterface {
    switch (type) {
        case SourceType.Dropbox:
            return new DropboxInterface({
                dropboxClient: new DropboxClient(settings.token as string)
            });
        case SourceType.WebDAV:
            return new WebDAVInterface({
                webdavClient: createWebdavClient(settings.endpoint as string, {
                    authType: AuthType.Auto,
                    username: settings.username,
                    password: settings.password
                })
            });
        case SourceType.GoogleDrive: {
            return new GoogleDriveInterface({
                googleDriveClient: new GoogleDriveClient(settings.token as string)
            });
        }
        default:
            throw new Error(`Unsupported interface: ${type}`);
    }
}
