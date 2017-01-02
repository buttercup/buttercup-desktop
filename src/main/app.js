/* eslint-disable no-unused-expressions */
import path from 'path';
import { app, BrowserWindow, Menu } from 'electron';
import pkg from '../../package.json';
import menuTemplate from './config/menu';
import WindowManager from './lib/window-manager';
import Platform from './lib/platform';
import AutoUpdater from './lib/updater';
import createRPC from './lib/rpc';
import './lib/buttercup';

const windowManager = WindowManager.getSharedInstance();
let appIsReady = false;
let initialFile = null;

/**
 * Open File helper using Buttercup
 * 
 * @param {String} filePath
 * @param {BrowserWindow} win
 */
function openFile(filePath, win) {
  filePath = decodeURI(filePath.replace(Platform.isWindows() ? /^file:[\/]{2,3}/ : 'file://', ''));
  filePath = path.normalize(filePath);
  if (path.extname(filePath).toLowerCase() !== '.bcup') {
    return;
  }
  if (!win) {
    win = BrowserWindow.getFocusedWindow();
  }
  // If there's a window and it's in intro state
  if (win && win.getTitle() === 'intro') {
    win.rpc.emit('open-file', filePath);
    return;
  }
  // Otherwise just create a new window
  windowManager.buildWindowOfType('main', (win, rpc) => {
    rpc.emit('open-file', filePath);
  });
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({showDevTools: true});
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
      } catch (e) {} // eslint-disable-line xo/catch-error-name
    }
  }
};

// Intro Screen
windowManager.setBuildProcedure('main', callback => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 870,
    height: 550,
    minWidth: 680,
    minHeight: 500,
    title: pkg.productName,
    titleBarStyle: 'hidden-inset',
    show: process.env.NODE_ENV === 'development',
    vibrancy: 'light'
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL(`file://${path.resolve(__dirname, '../../app/index.html')}`);
  } else {
    win.loadURL(`file://${path.resolve(__dirname, './index.html')}`);
  }

  const rpc = createRPC(win);
  win.rpc = rpc;

  // When user drops a file on the window
  win.webContents.on('will-navigate', (e, url) => {
    e.preventDefault();
    openFile(url, win);
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  rpc.on('init', () => {
    if (process.env.NODE_ENV !== 'development') {
      AutoUpdater(win);
    }

    if (callback) {
      callback(win, rpc);
    }
  });

  win.once('closed', () => {
    windowManager.deregister(win);
  });

  return win;
});

// In case user tries to open a file using Buttercup (on Mac)
app.on('open-file', (e, filePath) => {
  e.preventDefault();
  if (appIsReady === true) {
    openFile(filePath);
  } else {
    initialFile = filePath;
  }
});

// Open file using Buttercup (on Windows)
if (Platform.isWindows() && typeof process.argv[1] === 'string') {
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
      openFile(initialFile, win);
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
  if (Platform.isWindows()) {
    app.quit();
  }
});

// Create a new window if all windows are closed.
app.on('activate', () => {
  if (windowManager.getCountOfType('main') === 0) {
    windowManager.buildWindowOfType('main');
  }
});
