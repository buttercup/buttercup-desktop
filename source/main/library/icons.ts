import path from "path";
import { nativeImage } from "electron";
import { SourceType } from "../types";

const ICON_BUTTERCUP = path.resolve(__dirname, "../../../resources/images/buttercup-file-256.png");
const ICON_DROPBOX = path.resolve(__dirname, "../../../resources/images/dropbox-256.png");
const ICON_GOOGLEDRIVE = path.resolve(__dirname, "../../../resources/images/googledrive-256.png");
const ICON_WEBDAV = path.resolve(__dirname, "../../../resources/images/webdav-256.png");

const ICON_ERROR = path.resolve(__dirname, "../../../resources/icons/error.png");

const MENU_ICON_SIZE = 16;

export function getIconForProvider(provider: SourceType): string {
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
