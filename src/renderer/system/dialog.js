/* eslint-disable import/no-extraneous-dependencies */
import { remote } from 'electron';

const { dialog } = remote;

export function showOpenDialog() {
  return dialog.showOpenDialog(remote.getCurrentWindow());
}
