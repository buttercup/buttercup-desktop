import { globalShortcut, ipcMain as ipc } from 'electron';
import { getWindowManager } from './lib/window-manager';
import { setupMenu } from './menu';
import { getSetting } from '../shared/selectors';
import { DEFAULT_GLOBAL_SHORTCUTS } from '../shared/utils/global-shortcuts';

const windowManager = getWindowManager();

export const unregisterGlobalShortcuts = () => globalShortcut.unregisterAll();

const initGlobalShortcuts = {
  'preferences.minimize-and-maximize': shortcut =>
    globalShortcut.register(shortcut, () => {
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
    })
};

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
    const windows = windowManager._windows;

    state = store.getState();
    globalShortcuts = getSetting(state, 'globalShortcuts');

    if (name && accelerator) {
      const valid = acceleratorIsValid(store, accelerator, name);

      if (valid) {
        if (globalShortcuts[name]) {
          globalShortcut.unregister(globalShortcuts[name]);
        }
        if (initGlobalShortcuts[name]) {
          initGlobalShortcuts[name](accelerator);
        }

        setupMenu(store);
      }

      if (windows) {
        windows.forEach(({ window }) => {
          window.webContents.send('register-global-shortcut', {
            valid,
            name,
            accelerator
          });
        });
      }
    }
  });
};
