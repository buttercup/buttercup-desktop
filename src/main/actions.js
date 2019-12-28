import debounce from 'lodash/debounce';
import http from 'http';
import { ipcMain as ipc, BrowserWindow, app, shell } from 'electron';
import { ipcMain as betterIpc } from 'electron-better-ipc';
import { getWindowManager } from './lib/window-manager';
import { openFile, newFile, openFileForImporting } from './lib/files';
import { setupMenu } from './menu';
import { setupTrayIcon } from './tray';
import { getMainWindow } from './utils/window';
import i18n, { languages } from '../shared/i18n';
import localesConfig from '../../locales/config';
import { setupHost } from './lib/file-host';

const windowManager = getWindowManager();

export function setupActions(store) {
  // Update the menu
  store.subscribe(
    debounce(() => {
      setupMenu(store);
      setupTrayIcon(store);
    }, 500)
  );

  // Start File Host if Enabled
  setupHost(store);

  ipc.on('show-file-manager', () => {
    windowManager.buildWindowOfType('file-manager', null, {
      parent: BrowserWindow.getFocusedWindow()
    });
  });

  ipc.on('open-file-dialog', () => {
    openFile();
  });

  ipc.on('new-file-dialog', () => {
    newFile();
  });

  ipc.on('show-import-dialog', (e, payload) => {
    const { type, archiveId } = payload;
    openFileForImporting(undefined, type, archiveId);
  });

  ipc.on('change-locale-main', (e, lang) => {
    let locale = lang;
    if (!locale) {
      const win = getMainWindow();
      // set system lang
      locale = app.getLocale().split('-')[0] || localesConfig.fallbackLng;

      // check if its available
      if (!(locale in languages)) {
        locale = localesConfig.fallbackLng;
      }
      if (win) {
        win.webContents.send('change-initial-locale', locale);
      }
    }

    i18n.changeLanguage(locale);
    store.subscribe(debounce(() => setupMenu(store), 500));
  });

  betterIpc.answerRenderer('authenticate-google', async url => {
    shell.openExternal(url);
    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://buttercup.pw');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

        if (req.url) {
          const match = req.url.match(/\?googleauth&code=([^&#?]+)/);
          if (match && match.length > 1) {
            server.close(() => resolve(match[1]));
          }
        }
        res.end();
      });
      server.on('error', e => {
        server.close(() => reject(e));
      });
      server.listen(12822);
    });
  });
}
