// Borrowed from:
// https://github.com/zeit/hyper/blob/master/app/auto-updater.js
import { autoUpdater } from 'electron';
import ms from 'ms';
import pkg from '../../../package.json';
import Platform from './platform';

// accepted values: `osx`, `win32`
// https://nuts.gitbook.com/update-windows.html
const platform = Platform.isOSX() ? 'osx' : process.platform;
const FEED_URL = `https://download.buttercup.pw/update/${platform}`;
let isInit = false;

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

  isInit = true;
}

module.exports = function (win) {
  const { rpc } = win;

  if (!isInit) {
    init();
  }

  const onupdate = (e, releaseNotes, releaseName) => {
    rpc.emit('update-available', {
      releaseNotes, releaseName
    });
  };

  autoUpdater.on('update-downloaded', onupdate);

  rpc.once('quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });

  win.on('close', () => {
    autoUpdater.removeListener('update-downloaded', onupdate);
  });
};
