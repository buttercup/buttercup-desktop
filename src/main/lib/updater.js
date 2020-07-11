import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';
import { getWindowManager } from './window-manager';
import { app, ipcMain, dialog } from 'electron';
import { isLinux } from '../../shared/utils/platform';
import i18n from '../../shared/i18n';
import { getMainWindow } from '../utils/window';

const windowManager = getWindowManager();
let isSilent;
let __updateWin;

if (process.env.NODE_ENV !== 'production') {
  autoUpdater.updateConfigPath = path.join(
    __dirname,
    '../../../dev-app-update.yml'
  );
}

// Set logger
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Configure updater
autoUpdater.allowPrerelease = false;
autoUpdater.autoDownload = false;

autoUpdater.on('update-available', ({ version, releaseNotes }) => {
  if (__updateWin) {
    return;
  }
  __updateWin = windowManager.buildWindowOfType('update', win => {
    win.webContents.send('update-available', {
      version,
      releaseNotes,
      currentVersion: app.getVersion(),
      canUpdateAutomatically: !isLinux()
    });
  });
  __updateWin.on('close', () => {
    __updateWin = null;
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
  if (__updateWin) {
    __updateWin.webContents.send('update-error', error);
  }
});

autoUpdater.addListener('update-not-available', event => {
  if (!isSilent) {
    const focusedWindow = getMainWindow();
    dialog.showMessageBox(focusedWindow, {
      type: 'info',
      message: i18n.t('info.update-not-available')
    });
  }
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

export function checkForUpdates(silent = false) {
  isSilent = silent;
  try {
    autoUpdater.checkForUpdates();
  } catch (err) {
    log.error(err);
  }
}
