import { remote } from "electron";

const { BrowserWindow } = remote;

export async function authenticate(authURL: string, matchRegex: RegExp): Promise<string | null> {
    return "5wuMUtR1AewAAAAAAAAAAdBee4QWq5WQIN8LjfzZx0i3nhgFUoSe_b4nn-y7mMAa"; // @todo remove
    const currentWindow = BrowserWindow.getFocusedWindow();
    return new Promise<string>(resolve => {
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
                return resolve(foundToken);
            }
            resolve(null);
        };

        authWin.webContents.on("did-start-navigation", (e, url) => navigateCB(url));
        // authWin.webContents.on("did-get-redirect-request", (e, oldUrl, newUrl) =>
        //     navigateCB(newUrl)
        // );
        authWin.webContents.on("will-redirect", (e, url) => navigateCB(url));
        authWin.on("hide", closeCB);
        authWin.on("close", closeCB);
    });
}
