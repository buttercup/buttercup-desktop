import { startFileHost } from '@buttercup/secure-file-host';
import { getWindowManager } from './window-manager';
import { reopenMainWindow } from '../utils/window';

const windowManager = getWindowManager();

const showConnectionWindow = code => {
  reopenMainWindow(win => {
    windowManager.buildWindowOfType(
      'file-host-connection',
      connectionWindow => {
        connectionWindow.webContents.send('code-ready', code);
      },
      {
        parent: win
      }
    );
  });
};

export function startHost() {
  const host = startFileHost(12821);
  host.emitter.on('codeReady', ({ code }) => {
    showConnectionWindow(code);
  });
  host.emitter.on('connected', (...args) => {
    console.log('connected', args);
  });
}
