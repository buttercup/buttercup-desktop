import { startFileHost } from '@buttercup/secure-file-host';
import { getWindowManager } from './window-manager';

const windowManager = getWindowManager();

export function startHost() {
  const host = startFileHost(12821);
  host.emitter.on('codeReady', (...args) => {
    console.log('code ready', args);
  });
  host.emitter.on('connected', (...args) => {
    console.log('connected', args);
  });
}
