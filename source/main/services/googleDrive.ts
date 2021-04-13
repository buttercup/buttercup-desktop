import { shell } from "electron";
import { DatasourceAuthManager, GoogleDriveDatasource } from "buttercup";
import { OAuth2Client } from "@buttercup/google-oauth2-client";
import { getProtocolEmitter } from "./protocol";
import { logInfo, logWarn } from "../library/log";
import {
    GOOGLE_AUTH_REDIRECT,
    GOOGLE_AUTH_TIMEOUT,
    GOOGLE_DRIVE_SCOPES_PERMISSIVE,
    GOOGLE_DRIVE_SCOPES_STANDARD,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
} from "../../shared/symbols";

let __googleDriveOAuthClient: OAuth2Client = null;

async function authenticateGoogleDrive(
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
    shell.openExternal(url);
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

async function authenticateGoogleDriveWithRefreshToken(
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
    return new Promise<string>((resolve, reject) => {
        const emitter = getProtocolEmitter();
        const onAuth = (args: Array<string>) => {
            const path = args.join("/");
            const match = path.match(/\?googledesktopauth&code=([^&#?]+)/);
            if (match !== null && match.length > 0) {
                resolve(match[1]);
            } else {
                reject(new Error("Authentication failed"));
            }
            clearTimeout(timeout);
        };
        const timeout = setTimeout(() => {
            reject(new Error("Timed-out waiting for Google authentication"));
            emitter.off("authGoogle", onAuth);
        }, GOOGLE_AUTH_TIMEOUT);
        emitter.once("authGoogle", onAuth);
    });
}

export function registerGoogleDriveAuthHandlers() {
    DatasourceAuthManager.getSharedManager().registerHandler(
        "googledrive",
        async (datasource: GoogleDriveDatasource) => {
            logInfo("Google Drive datasource needs re-authentication");
            const { refreshToken: currentRefreshToken } = datasource;
            if (!currentRefreshToken) {
                logInfo(
                    "Datasource does not contain a refresh token: Performing full authorisation"
                );
                const { accessToken, refreshToken } = await authenticateGoogleDrive();
                datasource.updateTokens(accessToken, refreshToken);
                if (!refreshToken) {
                    logWarn("Updating Google Drive datasource access token without refresh token");
                }
            } else {
                logInfo("Datasource contains refresh token: Refreshing authorisation");
                const { accessToken } = await authenticateGoogleDriveWithRefreshToken(
                    currentRefreshToken
                );
                datasource.updateTokens(accessToken, currentRefreshToken);
            }
            logInfo("Google Drive datasource tokens updated");
        }
    );
}
