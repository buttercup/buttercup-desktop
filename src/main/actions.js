import { ipcMain as ipc, BrowserWindow } from 'electron';
import { pushUpdate, updateInstalled } from '../shared/actions/update';
import { getWindowManager } from './lib/window-manager';
import { startAutoUpdate, installUpdates } from './lib/updater';
import { openFile, newFile, openFileForImporting } from './lib/files';
import { setupMenu } from './menu';

const windowManager = getWindowManager();

export function setupActions(store) {
  // Clear update notice
  store.dispatch(updateInstalled());

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

  ipc.on('archive-list-updated', (e, payload) => {
    setupMenu(store);
  });

  ipc.on('show-import-dialog', (e, payload) => {
    const { type, archiveId } = payload;
    openFileForImporting(undefined, type, archiveId);
  });
}
