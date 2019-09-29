import { remote } from 'electron';
import { OAuth2Client } from '@buttercup/google-oauth2-client';
import { instantiateInterface } from '@buttercup/file-interface';
import { createClient as createGoogleDriveClient } from '@buttercup/googledrive-client';
import { createClient as createDropboxClient } from '@buttercup/dropbox-client';
import { createClient as createWebdavClient } from 'webdav';
import { ArchiveTypes } from '../../shared/buttercup/types';

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

export async function authenticateGoogleDrive() {
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

  const authCode = await authenticate(url, /\?googleauth&code=([^&#?]+)/);
  const response = await oauth2Client.exchangeAuthCodeForToken(authCode);
  const {
    access_token: accessToken,
    refresh_token: refreshToken
  } = response.tokens;
  return {
    accessToken,
    refreshToken
  };
}

export function authenticateDropbox() {
  const redirectUri = 'https://buttercup.pw/';
  const clientId = '5fstmwjaisrt06t';
  const authUri = `https://www.dropbox.com/1/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

  return authenticate(authUri, /access_token=([^&]*)/);
}

export function getFsInstance(type, settings) {
  switch (type) {
    case ArchiveTypes.DROPBOX:
      return instantiateInterface('dropbox', {
        dropboxClient: createDropboxClient(settings.token)
      });
    case ArchiveTypes.WEBDAV:
      return instantiateInterface('webdav', {
        webdavClient: createWebdavClient(settings.endpoint, {
          username: settings.username,
          password: settings.password
        })
      });
    case ArchiveTypes.GOOGLEDRIVE: {
      return instantiateInterface('googledrive', {
        googleDriveClient: createGoogleDriveClient(settings.token)
      });
    }
    default:
      return null;
  }
}
