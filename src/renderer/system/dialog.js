import { remote } from 'electron';
import { default as swal } from 'sweetalert2';
//import 'style!raw!sweetalert2/dist/sweetalert2.css';
import '../styles/lib/sweetalert.global';
import styles from '../styles/sweetalert';

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
 * @param {Function} fn Callback
 * @returns {void}
 */
export function showOpenDialog (fn) {
  const filename = dialog.showOpenDialog(currentWindow, {
    ...dialogOptions,
    title: 'Load a Buttercup Archive'
  });
  
  if (filename && filename.length > 0) {
    fn(filename[0]);
  }
}

/**
 * Present a save dialog box
 * and return the filename if saved
 * 
 * @param {Function} fn Callback
 * @returns {void}
 */
export function showSaveDialog(fn) {
  const filename = dialog.showSaveDialog(currentWindow, {
    ...dialogOptions,
    title: 'Create a New Buttercup Archive'
  });

  if (typeof filename === 'string' && filename.length > 0) {
    fn(filename);
  }
}

export function showConfirmDialog(message, fn) {
  const buttons = ['Yes', 'No'];
  dialog.showMessageBox(currentWindow, {message, buttons}, resp => {
    fn(resp);
  });
}

export function showPasswordDialog(preConfirm) {
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
    preConfirm
  });
}
