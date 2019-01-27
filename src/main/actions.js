import debounce from 'lodash/debounce';
import { ipcMain as ipc, BrowserWindow, app } from 'electron';
import { getWindowManager } from './lib/window-manager';
import { openFile, newFile, openFileForImporting } from './lib/files';
import { setupMenu } from './menu';
import i18n, { languages } from '../shared/i18n';
import localesConfig from '../../locales/config';
import { setupHost } from './lib/file-host';

const windowManager = getWindowManager();

export function setupActions(store) {
  // Update the menu
  store.subscribe(debounce(() => setupMenu(store), 200));

  // Start File Host if Enabled
  setupHost(store);

  ipc.on('show-file-manager', () => {
    windowManager.buildWindowOfType('file-manager', null, {
      parent: BrowserWindow.getFocusedWindow()
    });
  });

  ipc.on('show-app-preferences', () => {
    windowManager.buildWindowOfType('app-preferences', null, {
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
    const windows = windowManager._windows;
    let locale = lang;

    if (!locale) {
      // set system lang
      locale = app.getLocale().split('-')[0] || localesConfig.fallbackLng;

      // check if its available
      if (!(locale in languages)) {
        locale = localesConfig.fallbackLng;
      }
    }

    // send update to all open windows
    if (windows) {
      windows.forEach(({ window }) => {
        if (window) {
          window.webContents.send('change-initial-locale', locale);
        }
      });
    }

    i18n.changeLanguage(locale);
    store.subscribe(debounce(() => setupMenu(store), 200));
  });
}
