import { remote } from 'electron';
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
    title: 'Master Password',
    input: 'password',
    showCancelButton: true,
    animation: false,
    customClass: styles.alert,
    confirmButtonClass: styles.confirm,
    confirmButtonText: 'Confirm',
    cancelButtonClass: styles.cancel,
    cancelButtonText: 'Nevermind',
    inputPlaceholder: 'Password',
    inputClass: styles.input,
    buttonsStyling: false,
    ...options,
    preConfirm
  });
}
