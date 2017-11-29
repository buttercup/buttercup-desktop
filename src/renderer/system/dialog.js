import { remote } from 'electron';
import i18n from '../../shared/i18n';
import { default as swal } from 'sweetalert2';
import '../styles/lib/sweetalert.global';
import styles from '../styles/sweetalert';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

export function showConfirmDialog(message, fn) {
  const buttons = [i18n.t('yes'), i18n.t('no')];
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

export function showPasswordDialog(preConfirm, options = {}) {
  const defaultFunc = password => Promise.resolve(password);
  if (typeof preConfirm === 'object') {
    options = preConfirm;
    preConfirm = defaultFunc;
  } else if (typeof preConfirm === 'undefined') {
    preConfirm = defaultFunc;
  }
  return swal({
    title: i18n.t('master-password'),
    input: 'password',
    showCancelButton: true,
    animation: false,
    customClass: styles.alert,
    confirmButtonClass: styles.confirm,
    confirmButtonText: i18n.t('confirm'),
    cancelButtonClass: styles.cancel,
    cancelButtonText: i18n.t('nevermind'),
    inputPlaceholder: i18n.t('password'),
    inputClass: styles.input,
    buttonsStyling: false,
    ...options,
    preConfirm
  });
}
