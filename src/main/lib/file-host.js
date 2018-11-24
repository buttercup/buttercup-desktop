import { startFileHost } from '@buttercup/secure-file-host';
import { getWindowManager } from './window-manager';
import { reopenMainWindow } from '../utils/window';
import { config } from '../../shared/config';
import { getSetting } from '../../shared/selectors';

let __host;
const CONFIG_KEY = 'fileHost.encryptionKey';
const windowManager = getWindowManager();
const encryptionKey = config.get(CONFIG_KEY);

const showConnectionWindow = async code => {
  const parent = await reopenMainWindow();
  windowManager.buildWindowOfType(
    'file-host-connection',
    connectionWindow => {
      connectionWindow.webContents.send('code-ready', code);
      connectionWindow.on('closed', () => {
        if (__host) {
          __host.cancel();
        }
      });
    },
    {
      parent
    }
  );
};

export function startHost() {
  if (__host) {
    return;
  }
  __host = startFileHost(12821, encryptionKey);
  __host.emitter.on('codeReady', ({ code }) => showConnectionWindow(code));
  __host.emitter.on('connected', () => {
    const [connectionWindow] = windowManager.getWindowsOfType(
      'file-host-connection'
    );
    if (connectionWindow) {
      connectionWindow.close();
    }
  });

  // Save key back to config
  config.set(CONFIG_KEY, __host.key);
}

export function stopHost() {
  if (__host) {
    __host.stop();
    __host = undefined;
  }
}

export function setupHost(store) {
  const state = store.getState();
  const isHostEnabled = getSetting(state, 'isBrowserAccessEnabled');
  if (isHostEnabled) {
    startHost();
  }
}
