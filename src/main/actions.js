import { ipcMain as ipc, BrowserWindow } from 'electron';
import fs from 'fs-extra';
import { getWindowManager } from './lib/window-manager';

const windowManager = getWindowManager();

ipc.on('read-archive', (event, arg) => {
  fs.ensureFileSync(arg);
  event.returnValue = fs.readFileSync(arg).toString('utf-8');
});

ipc.on('write-archive', (event, arg) => {
  fs.outputFileSync(arg.filename, arg.content);
  event.returnValue = true;
});

ipc.on('show-file-manager', () => {
  windowManager.buildWindowOfType('file-manager', null, {
    parent: BrowserWindow.getFocusedWindow()
  });
});
