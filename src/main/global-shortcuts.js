import { globalShortcut, ipcMain as ipc } from 'electron';
import { getWindowManager } from './lib/window-manager';
import { sendEventToMainWindow, reopenMainWindow } from './utils/window';
import { setupMenu } from './menu';
import { getSetting } from '../shared/selectors';
import { DEFAULT_GLOBAL_SHORTCUTS } from '../shared/utils/global-shortcuts';

const windowManager = getWindowManager();

// unregister all global shortcuts
export const unregisterGlobalShortcuts = () => globalShortcut.unregisterAll();

// sleep n ms
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// defined global shortcut methods
const initGlobalShortcuts = {
  'preferences.minimize-and-maximize': (shortcut, store) =>
    globalShortcut.register(shortcut, async () => {
      const state = store.getState();
      const [mainWindow] = windowManager.getWindowsOfType('main');
      const windows = windowManager._windows;

      if (getSetting(state, 'isTrayIconEnabled')) {
        if (!mainWindow) {
          reopenMainWindow();
        } else {
          try {
            if (windows) {
              await Promise.all(
                windows.map(async ({ type, window }) => {
                  if (type === 'file-manager') {
                    window.close();
                    await sleep(100);
                    mainWindow.close();
                  } else {
                    window.close();
                  }
                })
              );
            }
          } catch (e) {}
        }
      } else {
        if (mainWindow) {
          if (mainWindow.isMinimized()) {
            mainWindow.focus();
            mainWindow.restore();
          } else {
            mainWindow.minimize();
          }
        }
      }
    })
};

/**
 * Check if accelerator is already in use
 * @param {object} store
 * @param {string} accelerator
 * @param {string} name
 */
const acceleratorIsValid = (store, accelerator, name) => {
  const state = store.getState();
  const globalShortcuts = {
    ...DEFAULT_GLOBAL_SHORTCUTS,
    ...getSetting(state, 'globalShortcuts')
  };

  const findAccelerator = Object.keys(globalShortcuts).find(shortcutName => {
    return (
      globalShortcuts[shortcutName] === accelerator && shortcutName !== name
    );
  });

  return !findAccelerator;
};

/**
 * Setup all shortcuts
 * @param {object} store
 */
export const setupGlobalShortcuts = store => {
  let state = store.getState();
  let globalShortcuts = getSetting(state, 'globalShortcuts');

  // init shortcuts
  Object.keys(globalShortcuts).forEach(
    shortcutName =>
      initGlobalShortcuts[shortcutName] &&
      initGlobalShortcuts[shortcutName](globalShortcuts[shortcutName], store)
  );

  ipc.on('register-global-shortcut', (e, { name, accelerator }) => {
    state = store.getState();
    globalShortcuts = getSetting(state, 'globalShortcuts');

    if (name && accelerator) {
      const valid = acceleratorIsValid(store, accelerator, name);

      if (valid) {
        try {
          globalShortcut.unregister(globalShortcuts[name]);

          // register new defined shortcut
          if (initGlobalShortcuts[name]) {
            initGlobalShortcuts[name](accelerator, store);
          }

          // refresh menu
          setupMenu(store);
        } catch (e) {
          // invalid shortcut
        }
      }

      // send upfate if accelerator is valid
      sendEventToMainWindow('register-global-shortcut', {
        valid,
        name,
        accelerator
      });
    }
  });
};
