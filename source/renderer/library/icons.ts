import { SourceType } from "../types";

const ICON_BUTTERCUP = require("../../../resources/images/buttercup-file-256.png").default;
const ICON_DROPBOX = require("../../../resources/images/dropbox-256.png").default;
const ICON_GOOGLEDRIVE = require("../../../resources/images/googledrive-256.png").default;
const ICON_WEBDAV = require("../../../resources/images/webdav-256.png").default;

const ICON_ERROR = require("../../../resources/icons/error.png").default;

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
