import path from 'path';
import { ipcMain as ipc } from 'electron';
import i18n from '../../shared/i18n';
import { getWindowManager } from './window-manager';

const windowManager = getWindowManager();

/**
 * Present an open dialog box
 * and return the filename if selected
 *
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
export function openSearch(focusedWindow) {
  focusedWindow.webContents.send('open-archive-search');
}
