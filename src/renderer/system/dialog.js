import { remote } from 'electron';
import i18n from '../../shared/i18n';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

export function showConfirmDialog(message, fn) {
  const buttons = [i18n.t('confirm-dialog.yes'), i18n.t('confirm-dialog.no')];
  dialog.showMessageBox(currentWindow, { message, buttons }, resp => {
    fn(resp);
  });
}

export function showDialog(message, type = 'error') {
  if (message instanceof Error) {
    message = message.message;
  }
  dialog.showMessageBox(currentWindow, {
    type,
    message
  });
}
