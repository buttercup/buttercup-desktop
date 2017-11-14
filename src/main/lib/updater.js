import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import ms from 'ms';
import i18n from '../../shared/i18n';

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
  try {
    autoUpdater.checkForUpdates();
  } catch (err) {
    // NOOP
    log.error(
      i18n.formatMessage({
        id: 'check-for-update-error',
        defaultMessage: 'Check for Update Error'
      }),
      err
    );
  }
}
