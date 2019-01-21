import { globalShortcut } from 'electron';
import { getWindowManager } from './lib/window-manager';

const windowManager = getWindowManager();

export const setupGlobalShortcuts = () => {
  // global shortcut to max- and minimize the main window
  const MinMaxShortcut = globalShortcut.register(
    'CommandOrControl+Shift+X',
    () => {
      const windows = windowManager._windows;

      // send update to all open windows
      if (windows) {
        windows.forEach(({ window, type }) => {
          if (type === 'main') {
            if (!window.isVisible()) {
              window.focus();
              window.show();
            } else {
              window.minimize();
            }
          } else {
            window.close();
          }
        });
      }
    }
  );

  if (!MinMaxShortcut) {
    console.log('registration failed');
  }
};

export const unregisterGlobalShortcuts = () => globalShortcut.unregisterAll();
