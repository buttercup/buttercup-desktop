import { ipcMain as ipc, BrowserWindow } from 'electron';
import fs from 'fs-extra';
import { pushUpdate } from '../shared/actions/update';
import { getWindowManager } from './lib/window-manager';
import { startAutoUpdate, installUpdates } from './lib/updater';

const windowManager = getWindowManager();

export function setupActions(store) {
  if (process.env.NODE_ENV !== 'development') {
    startAutoUpdate((releaseNotes, releaseName) => {
      store.dispatch(pushUpdate({
        releaseNotes,
        releaseName
      }));
    });

    ipc.on('quit-and-install', () => {
      installUpdates();
    });
  }

  ipc.on('read-archive', (event, arg) => {
    fs.ensureFileSync(arg);
    event.returnValue = fs.readFileSync(arg).toString('utf-8');
  });

  ipc.on('write-archive', (event, arg) => {
    fs.outputFileSync(arg.filename, arg.content);
    event.returnValue = true;
  });

  ipc.on('show-file-manager', () => {
    windowManager.buildWindowOfType('file-manager', null, {
      parent: BrowserWindow.getFocusedWindow()
    });
  });
}
