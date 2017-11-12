import { remote } from 'electron';
import { formatMessage } from '../../shared/i18n';
import { default as swal } from 'sweetalert2';
import '../styles/lib/sweetalert.global';
import styles from '../styles/sweetalert';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

export function showConfirmDialog(message, fn) {
  const buttons = ['Yes', 'No'];
  dialog.showMessageBox(currentWindow, { message, buttons }, resp => {
    fn(resp);
  });
}

export function showDialog(message, type = 'error') {
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
    title: formatMessage({ id: 'system.dialog.title' }),
    input: 'password',
    showCancelButton: true,
    animation: false,
    customClass: styles.alert,
    confirmButtonClass: styles.confirm,
    confirmButtonText: formatMessage({ id: 'system.dialog.confirm' }),
    cancelButtonClass: styles.cancel,
    cancelButtonText: formatMessage({ id: 'system.dialog.nevermind' }),
    inputPlaceholder: formatMessage({ id: 'system.dialog.password' }),
    inputClass: styles.input,
    buttonsStyling: false,
    ...options,
    preConfirm
  });
}
