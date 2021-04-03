import { FileSystemInterface, instantiateInterface } from "@buttercup/file-interface";
import { createClient as createGoogleDriveClient } from "@buttercup/googledrive-client";
import { createClient as createDropboxClient } from "@buttercup/dropbox-client";
import { createClient as createWebdavClient } from "webdav";
import { SourceType } from "../types";

export interface FSInstanceSettings {
    endpoint?: string;
    password?: string;
    token?: string;
    username?: string;
}

export interface FSItem {
    identifier: string;
    name: string;
    type: "file" | "directory";
    size: number;
    parent: string;
}

export function getFSInstance(type: SourceType, settings: FSInstanceSettings): FileSystemInterface {
    switch (type) {
        case SourceType.Dropbox:
            return instantiateInterface("dropbox", {
                dropboxClient: createDropboxClient(settings.token)
            });
        case SourceType.WebDAV:
            return instantiateInterface("webdav", {
                webdavClient: createWebdavClient(settings.endpoint, {
                    username: settings.username,
                    password: settings.password
                })
            });
        case SourceType.GoogleDrive: {
            return instantiateInterface("googledrive", {
                googleDriveClient: createGoogleDriveClient(settings.token)
            });
        }
        default:
            throw new Error(`Unsupported interface: ${type}`);
    }
}
