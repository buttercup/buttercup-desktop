import { Preferences, ThemeSource } from "./types";

export const DEFAULT_LANGUAGE = "en";
export const DROPBOX_CLIENT_ID = "5fstmwjaisrt06t";
export const GOOGLE_AUTH_REDIRECT = "https://buttercup.pw?googledesktopauth";
export const GOOGLE_CLIENT_ID = "327941947801-fumr4be9juk0bu3ekfuq9fr5bm7trh30.apps.googleusercontent.com";
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
