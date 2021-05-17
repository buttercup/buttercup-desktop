import { Preferences, ThemeSource } from "./types";

export const APP_ID = "pw.buttercup.desktop";
export const DEFAULT_LANGUAGE = "en";
export const DROPBOX_CLIENT_ID = "5fstmwjaisrt06t";
export const GOOGLE_AUTH_REDIRECT = "https://buttercup.pw?googledesktopauth";
export const GOOGLE_AUTH_TIMEOUT = 5 * 60 * 1000;
const GOOGLE_DRIVE_BASE_SCOPES = ["email", "profile"];
export const GOOGLE_DRIVE_SCOPES_STANDARD = [
    ...GOOGLE_DRIVE_BASE_SCOPES,
    "https://www.googleapis.com/auth/drive.file" // Per-file access
];
export const GOOGLE_DRIVE_SCOPES_PERMISSIVE = [
    ...GOOGLE_DRIVE_BASE_SCOPES,
    "https://www.googleapis.com/auth/drive"
];
export const GOOGLE_CLIENT_ID =
    "327941947801-fumr4be9juk0bu3ekfuq9fr5bm7trh30.apps.googleusercontent.com";
export const GOOGLE_CLIENT_SECRET = "2zCBNDSXp1yIu5dyE5BVUWQZ";
export const ICON_UPLOAD = "upload";

export const PREFERENCES_DEFAULT: Preferences = {
    autoClearClipboard: false, // seconds
    fileHostEnabled: false,
    language: null,
    lockVaultsAfterTime: false, // seconds
    lockVaultsOnWindowClose: false,
    uiTheme: ThemeSource.System
};
