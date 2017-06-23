import { app, Menu } from 'electron';
import pify from 'pify';
import log from 'electron-log';
import { throttle } from 'lodash';
import jsonStorage from 'electron-json-storage';
import configureStore from '../shared/store/configure-store';
import menuTemplate from './config/menu';
import { getWindowManager } from './lib/window-manager';
import { loadFile } from './lib/files';
import { isWindows } from './lib/platform';
import { setupActions } from './actions';
import { setupWindows } from './windows';

log.info('Buttercup starting up...');

// Unhandled rejections
const unhandled = require('electron-unhandled');
unhandled();

const storage = pify(jsonStorage);
const windowManager = getWindowManager();

let appIsReady = false;
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
    submitURL: 'https://electron-crash-reporter.appspot.com/5642489998344192/create/',
    uploadToServer: true
  });
}

const installExtensions = async () => {
  require('electron-debug')({
    showDevTools: true
  });

  const installer = require('electron-devtools-installer');

  const forceDownload = Boolean(process.env.UPGRADE_EXTENSIONS);
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

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
if (isWindows() && typeof process.argv[1] === 'string') {
  initialFile = process.argv[1];
}

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    // Install Dev Extensions
    await installExtensions();
  }

  // Create Store
  const state = await storage.get('state');
  const store = configureStore(state, 'main');

  // Persist Store to Disk
  store.subscribe(throttle(() => {
    storage.set('state', store.getState());
  }, 100));

  // Setup Windows & IPC Actions
  setupWindows(store);
  setupActions(store);

  appIsReady = true;

  // Show intro
  windowManager.buildWindowOfType('main', win => {
    // If the app has been started in order to open a file
    // launch that file after the main window has been created.
    if (initialFile) {
      loadFile(initialFile, win);
      initialFile = null;
    }
  });

  // Show standard menu
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(menuTemplate)
  );
});

// When user closes all windows
// On Windows, the command practice is to quit the app.
app.on('window-all-closed', () => {
  if (isWindows()) {
    app.quit();
  }
});

// Create a new window if all windows are closed.
app.on('activate', () => {
  if (windowManager.getCountOfType('main') === 0) {
    windowManager.buildWindowOfType('main');
  }
});
