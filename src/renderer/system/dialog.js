/* eslint-disable import/no-extraneous-dependencies */
import { remote } from 'electron';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();
const dialogOptions = {
  filters: [{
    name: 'Buttercup Archives',
    extensions: ['bcup']
  }]
};

/**
 * Present an open dialog box
 * and return the filename if selected
 * 
 * @returns {string|boolean}
 */
export function showOpenDialog () {
  const filename = dialog.showOpenDialog(currentWindow, {
    ...dialogOptions,
    title: 'Load a Buttercup Archive'
  });
  
  if (filename && filename.length > 0) {
    return filename[0];
  }

  return false;
}

/**
 * Present a save dialog box
 * and return the filename if saved
 * 
 * @returns {string|boolean}
 */
export function showSaveDialog() {
  const filename = dialog.showSaveDialog(currentWindow, {
    ...dialogOptions,
    title: 'Create a New Buttercup Archive'
  });

  if (typeof filename === 'string' && filename.length > 0) {
    return filename;
  }

  return false;
}
