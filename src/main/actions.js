import debounce from 'lodash/debounce';
import log from 'electron-log';
import { ipcMain as ipc, BrowserWindow, app } from 'electron';
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
}

function handleAuthCall(args) {
  if (!Array.isArray(args) || args.length === 0) {
    log.warn('Empty auth call. Abborting.');
    return;
  }
  const [action, ...actionArgs] = args;

  switch (action) {
    case 'google':
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('protocol:auth/google', actionArgs);
      });
      break;
    default:
      log.warn('Unable to handle google authentication result.');
      break;
  }
}

export function handleProtocolCall(url) {
  if (typeof url !== 'string' || url.length === 0) {
    log.warn('Empty protocol call. Abborting.');
    return;
  }
  const path = url.replace('buttercup://', '');
  const [action, ...args] = path.split('/');

  switch (action) {
    case 'auth':
      handleAuthCall(args);
      break;
    default:
      log.warn(`Unable to handle ${action}`);
      break;
  }
}
