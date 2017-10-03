import { remote } from 'electron';
import webdavFs from 'webdav-fs';
import dropboxFs from 'dropbox-fs';
import anyFs from 'any-fs';

const { BrowserWindow } = remote;
const currentWindow = BrowserWindow.getFocusedWindow();

export function authenticateDropbox() {
  return new Promise((resolve, reject) => {
    let foundToken = null;
    const authWin = new BrowserWindow({
      parent: currentWindow,
      // modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        webSecurity: false,
        sandbox: true
      }
    });

    const redirectUri = 'https://buttercup.pw/';
    const clientId = '5fstmwjaisrt06t';
    const authUri = `https://www.dropbox.com/1/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;
    authWin.loadURL(authUri);
    authWin.show();

    const navigateCb = url => {
      const match = url.match(/access_token=([^&]*)/);

      if (match !== null && match.length > 0) {
        foundToken = match[1];
        authWin.hide();
      }
    };

    const closeCb = () => {
      if (foundToken) {
        resolve(foundToken);
      } else {
        reject(new Error('Auth unsuccessful.'));
      }
    };

    authWin.webContents.on('will-navigate', (e, url) => navigateCb(url));
    authWin.webContents.on('did-get-redirect-request', (e, oldUrl, newUrl) =>
      navigateCb(newUrl)
    );
    authWin.on('hide', closeCb);
    authWin.on('close', closeCb);
  });
}

export function getFsInstance(type, settings) {
  switch (type) {
    case 'dropbox':
      return anyFs(
        dropboxFs({
          apiKey: settings.token
        })
      );
    case 'webdav':
      return anyFs(
        webdavFs(settings.endpoint, settings.username, settings.password)
      );
    default:
      return null;
  }
}
