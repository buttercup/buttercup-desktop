import { remote } from 'electron';
import webdavFs from 'webdav-fs';
import dropboxFs from 'dropbox-fs';
import anyFs from 'any-fs';
import { OAuth2Client } from '@buttercup/google-oauth2-client';

const { BrowserWindow } = remote;
const currentWindow = BrowserWindow.getFocusedWindow();

export function authenticate(authUri, matchRegex) {
  return new Promise((resolve, reject) => {
    let foundToken = null;
    const authWin = new BrowserWindow({
      parent: currentWindow,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        webSecurity: false,
        sandbox: true
      }
    });

    authWin.loadURL(authUri);
    authWin.show();

    const navigateCb = url => {
      const match = url.match(matchRegex);

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

    authWin.webContents.on('did-start-navigation', (e, url) => navigateCb(url));
    authWin.webContents.on('did-get-redirect-request', (e, oldUrl, newUrl) =>
      navigateCb(newUrl)
    );
    authWin.on('hide', closeCb);
    authWin.on('close', closeCb);
  });
}

export function authenticateGoogleDrive() {
  const oauth2Client = new OAuth2Client(
    '327941947801-fumr4be9juk0bu3ekfuq9fr5bm7trh30.apps.googleusercontent.com',
    '2zCBNDSXp1yIu5dyE5BVUWQZ',
    'https://buttercup.pw?googleauth'
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile', 'https://www.googleapis.com/auth/drive'],
    prompt: 'consent'
  });

  return authenticate(url, /\?googleauth&code=([^&#?]+)/);
}

export function authenticateDropbox() {
  const redirectUri = 'https://buttercup.pw/';
  const clientId = '5fstmwjaisrt06t';
  const authUri = `https://www.dropbox.com/1/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

  return authenticate(authUri, /access_token=([^&]*)/);
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
