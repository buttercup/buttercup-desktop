import { ipcMain as ipc, BrowserWindow, app } from 'electron';
import PiwikTracker from 'piwik-tracker';
import log from 'electron-log';
import { pushUpdate, updateInstalled } from '../shared/actions/update';
import { getWindowManager } from './lib/window-manager';
import { startAutoUpdate, installUpdates } from './lib/updater';
import { openFile, newFile, openFileForImporting } from './lib/files';
import { setupMenu } from './menu';

// Track Launches (anonymous)
const piwik = new PiwikTracker(2, 'https://analytics.buttercup.pw/piwik.php');

piwik.on('error', function(err) {
  log.error('Tracking error', err);
});

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

  ipc.on('track', (e, payload) => {
    piwik.track({
      url: 'buttercup://desktop/beta',
      action_name: 'Launch',
      ua: payload,
      cvar: JSON.stringify({
        '1': ['version', app.getVersion()],
        '2': [
          'production',
          process.env.NODE_ENV === 'development' ? 'No' : 'Yes'
        ]
      })
    });
  });
}
