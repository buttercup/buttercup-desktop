import { app, Menu } from 'electron';
import configureStore from '../shared/store/configure-store';
import menuTemplate from './config/menu';
import { getWindowManager } from './lib/window-manager';
import { loadFile } from './lib/files';
import { isWindows } from './lib/platform';
import { setupActions } from './actions';
import { setupWindows } from './windows';

global.store = configureStore(global.state, 'main');

setupWindows();
setupActions();

const windowManager = getWindowManager();
let appIsReady = false;
let initialFile = null;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({
    showDevTools: true
  });
}

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
  if (process.env.NODE_ENV === 'development') {
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
  await installExtensions();
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
