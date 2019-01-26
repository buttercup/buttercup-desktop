import { globalShortcut, ipcMain as ipc } from 'electron';
import { getWindowManager } from './lib/window-manager';
import { sendEventToMainWindow } from './utils/window';
import { setupMenu } from './menu';
import { getSetting } from '../shared/selectors';
import { DEFAULT_GLOBAL_SHORTCUTS } from '../shared/utils/global-shortcuts';

const windowManager = getWindowManager();
const windows = windowManager._windows;

// unregister all global shortcuts
export const unregisterGlobalShortcuts = () => globalShortcut.unregisterAll();

// defined global shortcut methods
const initGlobalShortcuts = {
  'preferences.minimize-and-maximize': shortcut =>
    globalShortcut.register(shortcut, () => {
      if (windows) {
        const [window] = windowManager.getWindowsOfType('main');

        if (window.isMinimized()) {
          window.focus();
          window.restore();
        } else {
          window.minimize();
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

  const findAccelerator = Object.keys(globalShortcuts).find(
    shortcutName =>
      globalShortcuts[shortcutName] === accelerator && shortcutName !== name
  );

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
      initGlobalShortcuts[shortcutName](globalShortcuts[shortcutName])
  );

  ipc.on('register-global-shortcut', (e, { name, accelerator }) => {
    state = store.getState();
    globalShortcuts = getSetting(state, 'globalShortcuts');

    if (name && accelerator) {
      const valid = acceleratorIsValid(store, accelerator, name);

      if (valid) {
        try {
          globalShortcut.unregister(globalShortcuts[name]);
        } catch (e) {
          // invalid shortcut
        }

        // register new defined shortcut
        if (initGlobalShortcuts[name]) {
          initGlobalShortcuts[name](accelerator);
        }

        // refresh menu
        setupMenu(store);
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
