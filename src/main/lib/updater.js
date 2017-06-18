import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

// Set logger
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

export function startAutoUpdate(cb) {
  autoUpdater.on('update-downloaded', ({ version, releaseNotes }) => cb(releaseNotes, version));
  autoUpdater.checkForUpdates();
}

export function installUpdates() {
  autoUpdater.quitAndInstall();
}
