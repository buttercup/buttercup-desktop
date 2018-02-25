/**
 * Toggle archive search
 *
 * @param {BrowserWindow} focusedWindow
 * @returns {void}
 */
export function toggleArchiveSearch(focusedWindow) {
  focusedWindow.webContents.send('toggle-archive-search');
}
