import { app, BrowserWindow } from 'electron';
import { getWindowManager } from './lib/window-manager';
import { getPathToFile } from './lib/utils';
import { createRPC } from './lib/rpc';
import { startAutoUpdate } from './lib/updater';
import { loadFile, openFile, newFile } from './lib/files';

const windowManager = getWindowManager();

// Intro Screen
windowManager.setBuildProcedure('main', callback => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 870,
    height: 550,
    minWidth: 680,
    minHeight: 500,
    title: app.getName(),
    titleBarStyle: 'hidden-inset',
    show: process.env.NODE_ENV === 'development',
    vibrancy: 'light'
  });

  win.loadURL(getPathToFile('views/index.html'));

  const rpc = createRPC(win);
  win.rpc = rpc;

  win.isIntro = () => {
    return win.getTitle().toLowerCase().match(/welcome/i) !== null;
  };

  // When user drops a file on the window
  win.webContents.on('will-navigate', (e, url) => {
    e.preventDefault();
    loadFile(url, win);
  });

  rpc.on('open-file-dialog', () => {
    openFile();
  });

  rpc.on('new-file-dialog', () => {
    newFile();
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  rpc.once('init', () => {
    if (process.env.NODE_ENV !== 'development') {
      startAutoUpdate(win);
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

windowManager.setBuildProcedure('file-manager', (callback, options) => {
  const win = new BrowserWindow({
    width: 650,
    height: 450,
    modal: true,
    show: false,
    resizable: false,
    ...options
  });

  win.loadURL(getPathToFile('views/file-manager.html'));

  win.once('ready-to-show', () => {
    win.show();
  });

  return win;
});
