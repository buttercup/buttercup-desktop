import { startFileHost } from '@buttercup/secure-file-host';
import { getWindowManager } from './window-manager';
import { reopenMainWindow } from '../utils/window';

let __host;
const windowManager = getWindowManager();

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
  __host = startFileHost(12821);
  __host.emitter.on('codeReady', ({ code }) => {
    showConnectionWindow(code);
  });
  __host.emitter.on('connected', (...args) => {
    console.log('connected', args);
  });
}
