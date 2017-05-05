import path from 'path';
import { BrowserWindow, dialog } from 'electron';
import { ArchiveTypes } from '../../shared/buttercup/types';
import { isWindows } from './platform';
import { getWindowManager } from './window-manager';
import { importArchive } from './buttercup';

const windowManager = getWindowManager();
const dialogOptions = {
  filters: [{
    name: 'Buttercup Archives',
    extensions: ['bcup']
  }]
};

function normalizePath(filePath) {
  filePath = decodeURI(filePath.replace(isWindows() ? /^file:[/]{2,3}/ : 'file://', ''));
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
  const payload = {
    type: ArchiveTypes.FILE,
    path: normalizePath(filePath),
    isNew
  };
  if (path.extname(filePath).toLowerCase() !== '.bcup') {
    return;
  }
  if (!win) {
    win = BrowserWindow.getFocusedWindow();
  }
  // If there's a window and it's in intro state
  if (win && win.isIntro()) {
    win.rpc.emit('load-archive', payload);
    return;
  }
  // Otherwise just create a new window
  windowManager.buildWindowOfType('main', (win, rpc) => {
    rpc.emit('load-archive', payload);
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
 * @param {BrowserWindow} focusedWindow
 * @param {string} type
 */
const showImportDialog = function(focusedWindow, type) {
  const types = {
    '1pif': {
      password: false,
      name: '1Password'
    },
    'kdbx': {
      password: true,
      name: 'KeePass'
    }
  };
  const typeInfo = types[type];

  if (!Object.keys(types).includes(type)) {
    throw new Error('Invalid import type requested');
  }

  const handleError = err => {
    setTimeout(() => {
      dialog.showMessageBox(focusedWindow, {
        title: 'Import Failed',
        message: `Importing from ${typeInfo.name} archive failed: ${err.message}`
      });
    }, 10);
  };

  const handleSuccess = history => {
    focusedWindow.rpc.emit('import-history', { history });
  };

  const [ filename ] = dialog.showOpenDialog(focusedWindow, {
    filters: [{
      name: `${typeInfo.name} Archives`,
      extensions: [type]
    }],
    title: `Load a ${typeInfo.name} archive`
  });

  if (!filename) {
    return;
  }

  if (typeInfo.password) {
    focusedWindow.rpc.emit('import-history-prompt');
    focusedWindow.rpc.once('import-history-prompt-resp', password => {
      importArchive(type, filename, password)
        .then(handleSuccess)
        .catch(handleError);
    });
  } else {
    importArchive(type, filename)
      .then(handleSuccess)
      .catch(handleError);
  }
};

/**
 * @param {BrowserWindow} focusedWindow
 * @param {string} type
 */
export function openFileForImporting(focusedWindow, type) {
  if (focusedWindow && focusedWindow.isIntro()) {
    dialog.showMessageBox(focusedWindow, {
      title: 'Importing is not available',
      message: 'To import an archive file, you must unlock a Buttercup archive first.'
    });
    return;
  }

  if (!focusedWindow) {
    focusedWindow = BrowserWindow.getFocusedWindow();
  }

  if (!focusedWindow) {
    windowManager.buildWindowOfType('main', win => {
      showImportDialog(win, type);
    });
    return;
  }
  showImportDialog(focusedWindow, type);
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
