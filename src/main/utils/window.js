import { BrowserWindow } from 'electron';
import { getWindowManager } from '../lib/window-manager';

export function getMainWindow(
  focusedWindow = BrowserWindow.getFocusedWindow()
) {
  if (focusedWindow) {
    return focusedWindow;
  }
  const wins = getWindowManager().getWindowsOfType('main');
  if (wins.length > 0) {
    const win = wins[0];
    if (win.isMinimized()) {
      win.restore();
    }
    return win;
  }
  return null;
}

export function sendEventToMainWindow(...args) {
  const mainWindow = getMainWindow();
  if (mainWindow !== null) {
    mainWindow.webContents.send(...args);
  }
}
