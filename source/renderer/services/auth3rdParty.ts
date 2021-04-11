import { remote } from "electron";
import { logInfo } from "../library/log";

const { BrowserWindow } = remote;

export async function authenticate(authURL: string, matchRegex: RegExp): Promise<string | null> {
    const currentWindow = BrowserWindow.getFocusedWindow();
    logInfo(`Starting 3rd party authentication procedure: ${authURL}`);
    return new Promise<string>((resolve) => {
        let foundToken = null;
        const authWin = new BrowserWindow({
            parent: currentWindow,
            show: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: false,
                webSecurity: false,
                sandbox: true
            }
        });

        authWin.loadURL(authURL);
        authWin.show();

        const navigateCB = (url: string) => {
            const match = url.match(matchRegex);
            if (match !== null && match.length > 0) {
                foundToken = match[1];
                authWin.hide();
            }
        };
        const closeCB = () => {
            if (foundToken) {
                logInfo("Completing 3rd party authentication with token");
                return resolve(foundToken);
            }
            logInfo("Completing 3rd party authentication without token");
            resolve(null);
        };

        authWin.webContents.on("did-start-navigation", (e, url) => navigateCB(url));
        authWin.webContents.on("will-redirect", (e, url) => navigateCB(url));
        authWin.on("hide", closeCB);
        authWin.on("close", closeCB);
    });
}
