// Borrowed from:
// https://github.com/zeit/hyper/blob/master/app/auto-updater.js
import { autoUpdater } from 'electron';
import ms from 'ms';
import pkg from '../../../package.json';
import { isOSX } from './platform';

// accepted values: `osx`, `win32`
// https://nuts.gitbook.com/update-windows.html
const platform = isOSX() ? 'osx' : process.platform;
const FEED_URL = `https://download.buttercup.pw/update/${platform}`;
let hasInitialized = false;

function init() {
  autoUpdater.setFeedURL(`${FEED_URL}/${pkg.version}`);

  autoUpdater.on('error', (err, msg) => {
    console.error('Error fetching updates', msg + ' (' + err.stack + ')');
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, ms('15s'));

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, ms('30m'));

  hasInitialized = true;
}

export function startAutoUpdate(cb) {
  if (!hasInitialized) {
    init();
  }

  autoUpdater.on(
    'update-downloaded',
    (e, releaseNotes, releaseName) => cb(releaseNotes, releaseName)
  );
}

export function installUpdates() {
  autoUpdater.quitAndInstall();
}
