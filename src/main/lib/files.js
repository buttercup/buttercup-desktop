import path from 'path';
import { BrowserWindow, dialog } from 'electron';
import { isWindows } from './platform';
import { getWindowManager } from './window-manager';
import { importKeepass } from './buttercup/import';

const windowManager = getWindowManager();
const dialogOptions = {
  filters: [{
    name: 'Buttercup Archives',
    extensions: ['bcup']
  }]
};
const keepassDialogOptions = {
  filters: [{
    name: 'KeePass Archives',
    extensions: ['kdbx']
  }]
};

function normalizePath(filePath) {
  filePath = decodeURI(filePath.replace(isWindows() ? /^file:[\/]{2,3}/ : 'file://', ''));
  filePath = path.normalize(filePath);
  return filePath;
}

/**
 * Present an open dialog box
 * and return the filename if selected
 * 
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
function showOpenDialog(focusedWindow) {
  const filename = dialog.showOpenDialog(focusedWindow, {
    ...dialogOptions,
    title: 'Load a Buttercup Archive'
  });
  
  if (filename && filename.length > 0) {
    loadFile(filename[0], focusedWindow);
  }
}

/**
 * Present a save dialog box
 * and return the filename if saved
 * 
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
function showSaveDialog(focusedWindow) {
  const filename = dialog.showSaveDialog(focusedWindow, {
    ...dialogOptions,
    title: 'Create a New Buttercup Archive'
  });

  if (typeof filename === 'string' && filename.length > 0) {
    loadFile(filename, focusedWindow, true);
  }
}

/**
 * Open File helper using Buttercup
 * 
 * @param {String} filePath
 * @param {BrowserWindow} win
 */
export function loadFile(filePath, win, isNew = false) {
  const emitAction = isNew ? 'new-file' : 'open-file';
  filePath = normalizePath(filePath);
  if (path.extname(filePath).toLowerCase() !== '.bcup') {
    return;
  }
  if (!win) {
    win = BrowserWindow.getFocusedWindow();
  }
  // If there's a window and it's in intro state
  if (win && win.getTitle() === 'intro') {
    win.rpc.emit(emitAction, filePath);
    return;
  }
  // Otherwise just create a new window
  windowManager.buildWindowOfType('main', (win, rpc) => {
    rpc.emit(emitAction, filePath);
  });
}

/**
 * Open a file in current window or a new window
 * if the current window is already a loaded archive
 * 
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
export function openFile(focusedWindow) {
  if (!focusedWindow) {
    focusedWindow = BrowserWindow.getFocusedWindow();
  }
  if (!focusedWindow) {
    windowManager.buildWindowOfType('main', win => {
      showOpenDialog(win);
    });
    return;
  }
  showOpenDialog(focusedWindow);
}

/**
 * Import a KeePass archive
 * 
 * @param {BrowserWindow} focusedWindow
 */
export function openKeepassFile(focusedWindow) {
  const showKeepassDialog = function(focusedWindow) {
    const filename = dialog.showOpenDialog(focusedWindow, {
      ...keepassDialogOptions,
      title: 'Load a Keepass archive'
    });
    
    if (filename && filename.length > 0) {
      focusedWindow.rpc.emit('import-history-prompt');
      focusedWindow.rpc.once('import-history-prompt-resp', password => {
        importKeepass(filename[0], password)
          .then(history => {
            focusedWindow.rpc.emit('import-history', { history });
          }).catch(err => {
            setTimeout(() => {
              dialog.showMessageBox(focusedWindow, {
                buttons: ['OK'],
                title: 'Import failed.',
                message: `Importing from KeePass archive failed: ${err.message}`
              });
            }, 10);
          });
      });
    }
  };

  if (!focusedWindow) {
    focusedWindow = BrowserWindow.getFocusedWindow();
  }
  if (!focusedWindow) {
    windowManager.buildWindowOfType('main', win => {
      showKeepassDialog(win);
    });
    return;
  }
  showKeepassDialog(focusedWindow);
}

/**
 * Create a new file and open it in Buttercup
 * then ask the user for a password
 * 
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
export function newFile(focusedWindow) {
  if (!focusedWindow) {
    focusedWindow = BrowserWindow.getFocusedWindow();
  }
  if (!focusedWindow) {
    windowManager.buildWindowOfType('main', win => showSaveDialog(win));
    return;
  }
  showSaveDialog(focusedWindow);
}
