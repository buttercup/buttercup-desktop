import { ipcRenderer, remote } from "electron";
import { OAuth2Client } from "@buttercup/google-oauth2-client";
import { logInfo } from "../library/log";
import { GOOGLE_AUTH_REDIRECT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../shared/symbols";

const GOOGLE_DRIVE_BASE_SCOPES = ["email", "profile"];
const GOOGLE_DRIVE_SCOPES_STANDARD = [
    ...GOOGLE_DRIVE_BASE_SCOPES,
    "https://www.googleapis.com/auth/drive.file" // Per-file access
];
const GOOGLE_DRIVE_SCOPES_PERMISSIVE = [
    ...GOOGLE_DRIVE_BASE_SCOPES,
    "https://www.googleapis.com/auth/drive"
];

let __googleDriveOAuthClient: OAuth2Client = null;

export async function authenticateGoogleDrive(
    openPermissions: boolean = false
): Promise<{ accessToken: string; refreshToken: string }> {
    logInfo(`Authenticating Google Drive (permissive: ${openPermissions ? "yes" : "no"})`);
    const scopes = openPermissions ? GOOGLE_DRIVE_SCOPES_PERMISSIVE : GOOGLE_DRIVE_SCOPES_STANDARD;
    const oauth2Client = getGoogleDriveOAuthClient();
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [...scopes],
        prompt: "consent select_account"
    });
    logInfo(`Google Drive: Opening authentication URL: ${url}`);
    remote.shell.openExternal(url);
    const authCode = await listenForGoogleAuthCode();
    logInfo("Google Drive:  Received auth code - exchanging for tokens");
    const response = await oauth2Client.exchangeAuthCodeForToken(authCode);
    const { access_token: accessToken, refresh_token: refreshToken } = response.tokens;
    logInfo("Google Drive: tokens received");
    return {
        accessToken,
        refreshToken
    };
}

export async function authenticateGoogleDriveWithRefreshToken(
    refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
    logInfo("Refreshing Google Drive token");
    const oauth2Client = getGoogleDriveOAuthClient();
    const results = await oauth2Client.refreshAccessToken(refreshToken);
    const { access_token: newAccessToken } = results.tokens;
    logInfo("Refreshed Google Drive token");
    return {
        accessToken: newAccessToken,
        refreshToken
    };
}

function getGoogleDriveOAuthClient(): OAuth2Client {
    if (!__googleDriveOAuthClient) {
        __googleDriveOAuthClient = new OAuth2Client(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_AUTH_REDIRECT
        );
    }
    return __googleDriveOAuthClient;
}

async function listenForGoogleAuthCode(): Promise<string> {
    const channel = "protocol:auth/google";
    return new Promise<string>((resolve, reject) => {
        const callback = (e, args) => {
            const path = args.join("/");
            const match = path.match(/\?googledesktopauth&code=([^&#?]+)/);
            if (match !== null && match.length > 0) {
                ipcRenderer.removeAllListeners(channel);
                resolve(match[1]);
            } else {
                reject(new Error("Authentication failed"));
            }
        };
        ipcRenderer.removeAllListeners(channel);
        ipcRenderer.on(channel, callback);
    });
}
