import { remote } from 'electron';
import i18n from '../../shared/i18n';
import { default as swal } from 'sweetalert2';
import '../styles/lib/sweetalert.global';
import styles from '../styles/sweetalert';

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

/**
 * _checkPasswordStrength
 * Check password security rules
 * Password should have:
 *   - one uppercase letter minimum.
 *   - one lowercase letter minimum.
 *   - one number.
 *   - one special character.
 *   - it should be > 10 < 128 characters.
 * @param {string} password password to check.
 * @return true if the paswoard is secure, false otherwise.
 */
function _checkPasswordStrength(password) {
  const strongPasswordRegex =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})';

  return new RegExp(strongPasswordRegex).test(password);
}

export function showPasswordDialog(preConfirm, options = {}) {
  const defaultFunc = password =>
    _checkPasswordStrength(password)
      ? Promise.resolve(password)
      : Promise.reject(i18n.t('password-dialog.not-strong-enought'));
  if (typeof preConfirm === 'object') {
    options = preConfirm;
    preConfirm = defaultFunc;
  } else if (typeof preConfirm === 'undefined') {
    preConfirm = defaultFunc;
  }
  return swal({
    title: i18n.t('password-dialog.master-password'),
    input: 'password',
    showCancelButton: true,
    animation: false,
    customClass: styles.alert,
    confirmButtonClass: styles.confirm,
    confirmButtonText: i18n.t('password-dialog.confirm'),
    cancelButtonClass: styles.cancel,
    cancelButtonText: i18n.t('password-dialog.nevermind'),
    inputPlaceholder: i18n.t('password-dialog.password'),
    inputClass: styles.input,
    buttonsStyling: false,
    ...options,
    preConfirm
  });
}

export function showConfirmedPasswordDialog(
  preConfirm,
  firstDialogOptions = {},
  secondDialogOptions = {}
) {
  return showPasswordDialog(undefined, firstDialogOptions).then(firstPassword =>
    showPasswordDialog(password => {
      if (firstPassword !== password) {
        return Promise.reject(new Error(i18n.t('error.passwords-dont-match')));
      }
      if (typeof preConfirm === 'function') {
        return preConfirm(password);
      }
      return Promise.resolve();
    }, secondDialogOptions)
  );
}
