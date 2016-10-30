import path from 'path';
import { app, BrowserWindow, Menu } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import pkg from '../../package.json';
import menuTemplate from './config/menu';
import WindowManager from './lib/window-manager';
import createRPC from './rpc';
import './lib/buttercup';

const windowManager = WindowManager.getSharedInstance();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({showDevTools: true}); // eslint-disable-line global-require
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable global-require

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
    width: 1000,
    height: 750,
    minWidth: 680,
    minHeight: 500,
    title: pkg.productName,
    titleBarStyle: 'hidden-inset',
    show: process.env.NODE_ENV === 'development'
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL(`file://${path.resolve(__dirname, '../../dist/index.html')}`);
  } else {
    win.loadURL(`file://${path.resolve(__dirname, './index.html')}`);
  }

  const rpc = createRPC(win);
  win.rpc = rpc;

  win.once('ready-to-show', () => {
    win.show();
  });

  rpc.on('init', () => {
    if (callback) {
      callback(win, rpc);
    }
  });

  return win;
});

app.on('ready', async () => {
  await installExtensions();

  // Show intro
  windowManager.buildWindowOfType('main');

  // Show standard menu
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(menuTemplate)
  );
});

// When user closes all windows
app.on('window-all-closed', () => {
  // windowManager.buildWindowOfType('main');
});
