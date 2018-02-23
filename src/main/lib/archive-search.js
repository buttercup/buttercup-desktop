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
