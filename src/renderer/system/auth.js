import { remote, ipcRenderer } from 'electron';
import { OAuth2Client } from '@buttercup/google-oauth2-client';
import { instantiateInterface } from '@buttercup/file-interface';
import { createClient as createGoogleDriveClient } from '@buttercup/googledrive-client';
import { createClient as createDropboxClient } from '@buttercup/dropbox-client';
import { createClient as createWebdavClient } from 'webdav';
import { ArchiveTypes } from '../../shared/buttercup/types';
import { MyButtercupClient } from '../../shared/buttercup/buttercup';
import {
  MYBUTTERCUP_CLIENT_ID,
  MYBUTTERCUP_CLIENT_SECRET,
  MYBUTTERCUP_REDIRECT_URI
} from '../../shared/myButtercup';

const { BrowserWindow } = remote;
const currentWindow = BrowserWindow.getFocusedWindow();

let __googleDriveOAuthClient;

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
    authWin.webContents.on('will-redirect', (e, url) => navigateCb(url));
    authWin.on('hide', closeCb);
    authWin.on('close', closeCb);
  });
}

function getGoogleDriveOAuthClient() {
  if (!__googleDriveOAuthClient) {
    __googleDriveOAuthClient = new OAuth2Client(
      '327941947801-fumr4be9juk0bu3ekfuq9fr5bm7trh30.apps.googleusercontent.com',
      '2zCBNDSXp1yIu5dyE5BVUWQZ',
      'https://buttercup.pw?googledesktopauth'
    );
  }
  return __googleDriveOAuthClient;
}

function listenForGoogleAuthCode() {
  const channel = 'protocol:auth/google';
  return new Promise((resolve, reject) => {
    const callback = (e, args) => {
      const path = args.join('/');
      const match = path.match(/\?googledesktopauth&code=([^&#?]+)/);

      if (match !== null && match.length > 0) {
        ipcRenderer.removeAllListeners(channel);
        resolve(match[1]);
      } else {
        reject(new Error('Authentication failed.'));
      }
    };
    ipcRenderer.removeAllListeners(channel);
    ipcRenderer.on(channel, callback);
  });
}

export async function authenticateGoogleDrive() {
  const oauth2Client = getGoogleDriveOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile', 'https://www.googleapis.com/auth/drive'],
    prompt: 'consent'
  });
  remote.shell.openExternal(url);

  const authCode = await listenForGoogleAuthCode();
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

export async function authenticateGoogleDriveWithRefreshToken(
  accessToken,
  refreshToken
) {
  const oauth2Client = getGoogleDriveOAuthClient();
  const results = await oauth2Client.refreshAccessToken(refreshToken);
  const { access_token: newAccessToken } = results.tokens;
  return {
    accessToken: newAccessToken,
    refreshToken
  };
}

export function authenticateDropbox() {
  const redirectUri = 'https://buttercup.pw/';
  const clientId = '5fstmwjaisrt06t';
  const authUri = `https://www.dropbox.com/1/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

  return authenticate(authUri, /access_token=([^&]*)/);
}

export function authenticateMyButtercup() {
  const authUri = MyButtercupClient.generateAuthorisationURL(
    MYBUTTERCUP_CLIENT_ID
  );
  return authenticate(authUri, /code=([^&]*)/);
}

export function exchangeMyButtercupAuthCode(authCode) {
  return MyButtercupClient.exchangeAuthCodeForTokens(
    authCode,
    MYBUTTERCUP_CLIENT_ID,
    MYBUTTERCUP_CLIENT_SECRET,
    MYBUTTERCUP_REDIRECT_URI
  );
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

export function getMyButtercupAccountDetails(accessToken, refreshToken) {
  const client = new MyButtercupClient(
    MYBUTTERCUP_CLIENT_ID,
    MYBUTTERCUP_CLIENT_SECRET,
    accessToken,
    refreshToken
  );
  return Promise.all([
    client.fetchUserVaultDetails(),
    client.retrieveDigest()
  ]).then(([details, digest]) => {
    const { id } = details;
    const { account_name: name } = digest;
    return { id, name };
  });
}
