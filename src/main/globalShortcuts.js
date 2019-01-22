import { globalShortcut, ipcMain as ipc } from 'electron';
import { getWindowManager } from './lib/window-manager';
import { getSetting } from '../shared/selectors';

const windowManager = getWindowManager();

export const unregisterGlobalShortcuts = () => globalShortcut.unregisterAll();

const initGlobalShortcuts = {
  'minimize-and-maximize': shortcut =>
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

const acceleratorIsValid = (store, accelerator) => {
  const state = store.getState();
  const globalShortcuts = getSetting(state, 'globalShortcuts');
  const findaccelerator = Object.entries(globalShortcuts).find(
    gs => gs.accelerator === accelerator
  );

  return !findaccelerator || findaccelerator === 1;
};

export const setupGlobalShortcuts = store => {
  const windows = windowManager._windows;

  ipc.on('register-global-shortcut', (e, { name, accelerator }) => {
    if (name && accelerator) {
      const valid = acceleratorIsValid(store, accelerator);

      if (valid) {
        globalShortcut.unregister(accelerator);
        initGlobalShortcuts[name](accelerator);
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

  const state = store.getState();
  const allGlobalShortcuts = getSetting(state, 'globalShortcuts');

  console.log(allGlobalShortcuts);
  // init shortcuts
  Object.keys(allGlobalShortcuts).forEach(
    shortcutName =>
      initGlobalShortcuts[shortcutName] &&
      initGlobalShortcuts[shortcutName](allGlobalShortcuts[shortcutName])
  );
};
