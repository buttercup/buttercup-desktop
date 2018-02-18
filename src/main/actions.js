import debounce from 'lodash/debounce';
import { ipcMain as ipc, BrowserWindow, app } from 'electron';
import { pushUpdate, updateInstalled } from '../shared/actions/update';
import { getWindowManager } from './lib/window-manager';
import { startAutoUpdate, installUpdates } from './lib/updater';
import { openFile, newFile, openFileForImporting } from './lib/files';
import { setupMenu } from './menu';
import { getMainWindow } from './utils/window';
import i18n, { languages } from '../shared/i18n';
import localesConfig from '../../locales/config';

const windowManager = getWindowManager();

export function setupActions(store) {
  // Clear update notice
  store.dispatch(updateInstalled());

  // Update the menu
  store.subscribe(debounce(() => setupMenu(store), 500));

  if (process.env.NODE_ENV !== 'development') {
    startAutoUpdate((releaseNotes, releaseName) => {
      store.dispatch(
        pushUpdate({
          releaseNotes,
          releaseName
        })
      );
    });

    ipc.on('quit-and-install', () => {
      installUpdates();
    });
  }

  ipc.on('show-update', () => {
    windowManager.buildWindowOfType('update');
  });

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
