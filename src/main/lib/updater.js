import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import ms from 'ms';
import { getWindowManager } from './window-manager';
import i18n from '../../shared/i18n';
import { app, ipcMain, dialog } from 'electron';

const windowManager = getWindowManager();
let __updateWin;

// Set logger
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Configure updater
autoUpdater.allowPrerelease = false;
autoUpdater.autoDownload = false;

autoUpdater.on('update-available', ({ version, releaseNotes }) => {
  __updateWin = windowManager.buildWindowOfType('update', win => {
    win.webContents.send('update-available', {
      version,
      releaseNotes,
      currentVersion: app.getVersion()
    });
  });
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('download-progress', progress => {
  if (__updateWin) {
    __updateWin.webContents.send('download-progress', progress);
  }
});

autoUpdater.on('error', error => {
  dialog.showErrorBox('Error', i18n.t('error.check-for-update'));
  if (__updateWin) {
    __updateWin.webContents.send('update-error', error);
  }
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

export function startAutoUpdate(cb) {
  checkForUpdates();
  setInterval(checkForUpdates, ms('15m'));
}

export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}
