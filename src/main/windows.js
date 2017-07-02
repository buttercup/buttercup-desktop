import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import debounce from 'lodash/debounce';
import { getWindowManager } from './lib/window-manager';
import { getPathToFile } from './lib/utils';
import { loadFile } from './lib/files';

const windowManager = getWindowManager();

export function setupWindows() {
  // Intro Screen
  windowManager.setBuildProcedure('main', callback => {
    // Create the browser window.
    const win = new BrowserWindow({
      width: 950,
      height: 700,
      minWidth: 680,
      minHeight: 500,
      title: app.getName(),
      titleBarStyle: 'hidden-inset',
      show: process.env.NODE_ENV === 'development',
      vibrancy: 'dark'
    });

    win.loadURL(getPathToFile('views/index.html'));

    // When user drops a file on the window
    win.webContents.on('will-navigate', (e, url) => {
      e.preventDefault();
      loadFile(url, win);
    });

    win.once('ready-to-show', () => {
      win.show();
    });

    ipc.once('init', () => {
      if (callback) {
        callback(win);
      }
    });

    win.on('resize', debounce(() => {
      win.webContents.send('size-change', win.getSize());
    }, 2000));

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
}
