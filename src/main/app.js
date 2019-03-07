import { app } from 'electron';
import pify from 'pify';
import log from 'electron-log';
import jsonStorage from 'electron-json-storage';
import configureStore from '../shared/store/configure-store';
import { setupMenu } from './menu';
import { setupTrayIcon } from './tray';
import { getWindowManager } from './lib/window-manager';
import { sendEventToMainWindow } from './utils/window';
import { loadFile } from './lib/files';
import { getQueue } from './lib/queue';
import { isWindows, isOSX } from '../shared/utils/platform';
import { sleep } from '../shared/utils/promise';
import { setupActions } from './actions';
import { setupWindows } from './windows';
import { getFilePathFromArgv } from './utils/argv';

log.info('Buttercup starting up...');

// Unhandled rejections
const unhandled = require('electron-unhandled');
unhandled();

const storage = pify(jsonStorage);
const windowManager = getWindowManager();

let appIsReady = false;
let appTriedToQuit = false;
let initialFile = null;

// Crash reporter for alpha and beta releases
// After we come out of beta, we should be rolling our own
// Crash reporter server using Mozilla Socorro
// https://github.com/mozilla/socorro
// This process is fail-safe. Even if the URL stops working
// The app has already crashed. lol.
if (process.env.NODE_ENV !== 'development') {
  const { crashReporter } = require('electron');
  crashReporter.start({
    productName: app.getName(),
    companyName: 'Buttercup LLC',
    submitURL:
      'https://electron-crash-reporter.appspot.com/5642489998344192/create/',
    uploadToServer: true
  });
}

const installExtensions = async () => {
  require('electron-debug')({
    showDevTools: true
  });

  const installer = require('electron-devtools-installer');
  const forceDownload = Boolean(process.env.UPGRADE_EXTENSIONS);
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload); // eslint-disable-line babel/no-await-in-loop
    } catch (err) {}
  }
};

// In case user tries to open a file using Buttercup (on Mac)
app.on('open-file', (e, filePath) => {
  e.preventDefault();
  if (appIsReady === true) {
    loadFile(filePath);
  } else {
    initialFile = filePath;
  }
});

// Open file using Buttercup (on Windows)
if (isWindows()) {
  initialFile = getFilePathFromArgv(process.argv);
}

// Someone tried to run a second instance, we should focus our window.
const isSecondInstance = app.makeSingleInstance(() => {
  log.info(
    'Detected a newer instance. Closing this instance.',
    app.getVersion()
  );
  app.quit();
});

if (isSecondInstance) {
  log.info('This is the newer version running.', app.getVersion());
}

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    // Install Dev Extensions
    await installExtensions();
  }

  // Create Store
  let state = {};
  try {
    state = await storage.get('state');
    log.info('Restoring state...', state);

    // Temporary bridge to new format
    // @TODO: remove this!
    if (state.archives && !Array.isArray(state.archives)) {
      storage.set('state.backup', state);
      log.info('Updating old state format to new.');
      state.archives = [];
      state.settingsByArchiveId = {};
    }
  } catch (err) {
    log.error('Unable to read state json file', err);
  }
  const store = configureStore(state);

  // Persist Store to Disk
  store.subscribe(() => {
    getQueue()
      .channel('saves')
      .enqueue(
        () => storage.set('state', store.getState()).then(() => sleep(100)),
        undefined,
        'store'
      );
  });

  // Setup Windows & IPC Actions
  setupWindows(store);
  setupActions(store);
  setupMenu(store);
  setupTrayIcon(store);

  appIsReady = true;

  // Show main window
  windowManager.buildWindowOfType('main', win => {
    // If the app has been started in order to open a file
    // launch that file after the main window has been created.
    if (initialFile) {
      loadFile(initialFile, win);
      initialFile = null;
    }
  });

  // When user closes all windows
  // On Windows, the command practice is to quit the app.
  app.on('window-all-closed', () => {
    if (appTriedToQuit || process.platform !== 'darwin') {
      app.quit();
    }
  });
});

// Create a new window if all windows are closed.
app.on('activate', () => {
  if (windowManager.getCountOfType('main') === 0) {
    if (isOSX()) {
      app.dock.show();
    }
    windowManager.buildWindowOfType('main');
  }
});

app.once('before-quit', e => {
  log.info('Running before-quit operation.');
  const channel = getQueue().channel('saves');
  appTriedToQuit = true;

  if (!channel.isEmpty) {
    log.info('Operation queue is not empty, waiting before quitting.');
    e.preventDefault();
    sendEventToMainWindow('save-started');
    channel.once('stopped', () => {
      sendEventToMainWindow('save-completed');
      app.quit();
    });
  } else {
    app.quit();
  }
});
