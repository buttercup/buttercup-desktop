import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import ms from 'ms';

// Set logger
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Enable pre-releases
autoUpdater.allowPrerelease = true;

export function startAutoUpdate(cb) {
  autoUpdater.on('update-downloaded', ({ version, releaseNotes }) =>
    cb(releaseNotes, version)
  );
  checkForUpdates();
  setInterval(checkForUpdates, ms('15m'));
}

export function installUpdates() {
  autoUpdater.quitAndInstall();
}

export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}
