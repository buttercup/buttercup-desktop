import path from 'path';
import { dialog, ipcMain as ipc } from 'electron';
import { ArchiveTypes, ImportTypeInfo } from '../../shared/buttercup/types';
import { isWindows } from '../../shared/utils/platform';
import i18n from '../../shared/i18n';
import { getWindowManager } from './window-manager';
import { importArchive } from './buttercup';
import { getMainWindow } from '../utils/window';

const windowManager = getWindowManager();
const dialogOptions = {
  filters: [
    {
      name: i18n.t('archive-dialog.buttercup-archives'),
      extensions: ['bcup']
    }
  ]
};

function normalizePath(filePath) {
  filePath = decodeURI(
    filePath.replace(isWindows() ? /^file:[/]{2,3}/ : 'file://', '')
  );
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
  dialog.showOpenDialog(
    focusedWindow,
    {
      ...dialogOptions,
      title: i18n.t('archive-dialog.load-a-buttercup-archive')
    },
    filename => {
      if (filename && filename.length > 0) {
        loadFile(filename[0], focusedWindow);
      }
    }
  );
}

/**
 * Present a save dialog box
 * and return the filename if saved
 *
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
function showSaveDialog(focusedWindow) {
  dialog.showSaveDialog(
    focusedWindow,
    {
      ...dialogOptions,
      title: i18n.t('archive-dialog.create-a-new-buttercup-archive')
    },
    filename => {
      if (typeof filename === 'string' && filename.length > 0) {
        loadFile(filename, focusedWindow, true);
      }
    }
  );
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
    win = getMainWindow();
  }

  // If we have found a window at this point
  if (win) {
    win.webContents.send('load-archive', payload);
    return;
  }

  // Otherwise create a new window
  windowManager.buildWindowOfType('main', newWindow =>
    newWindow.webContents.send('load-archive', payload)
  );
}

/**
 * Open a file in current window or a new window
 * if the current window is already a loaded archive
 *
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
export function openFile(focusedWindow) {
  focusedWindow = getMainWindow(focusedWindow);
  if (!focusedWindow) {
    windowManager.buildWindowOfType('main', win => showOpenDialog(win));
    return;
  }
  showOpenDialog(focusedWindow);
}

/**
 * Create a new file and open it in Buttercup
 * then ask the user for a password
 *
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
export function newFile(focusedWindow) {
  focusedWindow = getMainWindow(focusedWindow);
  if (!focusedWindow) {
    windowManager.buildWindowOfType('main', win => showSaveDialog(win));
    return;
  }
  showSaveDialog(focusedWindow);
}

/**
 * @param {BrowserWindow} focusedWindow
 * @param {string} type
 * @param {string} archiveId
 */
const showImportDialog = function(focusedWindow, type, archiveId) {
  const typeInfo = ImportTypeInfo[type];

  if (!typeInfo) {
    throw new Error(i18n.t('error.invalid-import-type-requested'));
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
    focusedWindow.webContents.send('import-history', { history, archiveId });
  };

  dialog.showOpenDialog(
    focusedWindow,
    {
      filters: [
        {
          name: `${typeInfo.name} Archives`,
          extensions: [typeInfo.extension]
        }
      ],
      title: `Load a ${typeInfo.name} archive`
    },
    files => {
      if (!files) {
        return;
      }
      const [filename] = files;
      if (typeInfo.password) {
        focusedWindow.webContents.send('import-history-prompt', type);
        ipc.once('import-history-prompt-resp', (e, password) => {
          importArchive(type, filename, password)
            .then(handleSuccess)
            .catch(handleError);
        });
      } else {
        importArchive(type, filename)
          .then(handleSuccess)
          .catch(handleError);
      }
    }
  );
};

/**
 * @param {BrowserWindow} focusedWindow
 * @param {string} type
 * @param {string} archiveId
 */
export function openFileForImporting(focusedWindow, type, archiveId) {
  focusedWindow = getMainWindow(focusedWindow);

  if (!focusedWindow) {
    throw new Error(i18n.t('error.open-file-for-importing'));
  }

  showImportDialog(focusedWindow, type, archiveId);
}
