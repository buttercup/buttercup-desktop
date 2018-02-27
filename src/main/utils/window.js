import { BrowserWindow, app } from 'electron';
import { getWindowManager } from '../lib/window-manager';
import { isOSX } from '../../shared/utils/platform';

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

export function checkDockVisibility() {
  if (isOSX() && !app.dock.isVisible()) {
    app.dock.show();
  }
}

export function reopenMainWindow(fn = () => { }) {
  const windowManager = getWindowManager();

  if (windowManager.getCountOfType('main') > 0) {
    const [mainWindow] = windowManager.getWindowsOfType('main');
    mainWindow.focus();
    mainWindow.show();
    fn(mainWindow);
  } else {
    windowManager.buildWindowOfType('main', fn);
  }

  checkDockVisibility();
}
