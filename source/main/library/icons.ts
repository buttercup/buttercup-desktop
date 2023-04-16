import path from "path";
import { nativeImage } from "electron";
import { getRootProjectPath } from "./paths";
import { SourceType } from "../types";

const MENU_ICON_SIZE = 16;

export function getIconForProvider(provider: SourceType): string {
    const root = getRootProjectPath();
    const ICON_BUTTERCUP = path.join(root, "resources/images/buttercup-file-256.png");
    const ICON_DROPBOX = path.join(root, "resources/images/dropbox-256.png");
    const ICON_GOOGLEDRIVE = path.join(root, "resources/images/googledrive-256.png");
    const ICON_WEBDAV = path.join(root, "resources/images/webdav-256.png");
    const ICON_ERROR = path.join(root, "resources/icons/error.png");
    switch (provider) {
        case SourceType.File:
            return ICON_BUTTERCUP;
        case SourceType.Dropbox:
            return ICON_DROPBOX;
        case SourceType.GoogleDrive:
            return ICON_GOOGLEDRIVE;
        case SourceType.WebDAV:
            return ICON_WEBDAV;
        default:
            return ICON_ERROR;
    }
}

export async function getNativeImageMenuIcon(fileSource: string) {
    const nImg = nativeImage.createFromPath(fileSource);
    const resized = nImg.resize({
        width: MENU_ICON_SIZE,
        height: MENU_ICON_SIZE,
        quality: "better"
    });
    return resized;
}
