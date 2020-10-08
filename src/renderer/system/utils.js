import path from 'path';
import { clipboard, remote, shell } from 'electron';
import ms from 'ms';

const currentWindow = remote.getCurrentWindow();
const isValidUrl = require('is-valid-http-url');

const __cache = {
  timer: null
};

export function copyToClipboard(
  text,
  isPassword,
  secondsUntilClearClipboard = 0
) {
  clipboard.writeText(text);

  // isPassword is a boolean
  if (isPassword) {
    if (__cache.timer) {
      clearTimeout(__cache.timer);
    }

    // Clean the clipboard after 15s if clipboard unchanged
    // @TODO: Make a UI for this.
    if (secondsUntilClearClipboard > 0) {
      // Clean the clipboard after n seconds
      __cache.timer = setTimeout(function clipboardPurgerClosure() {
        if (readClipboard() === text) {
          copyToClipboard('');
        }
      }, ms((secondsUntilClearClipboard || 15) + 's'));
    }

    __cache.timer = setTimeout(function clipboardPurgerClosure() {
      if (readClipboard() === text) {
        clipboard.clear();
      }
    }, ms('15s'));
  }
}

export function readClipboard() {
  return clipboard.readText();
}

export function isUrl(url) {
  return isValidUrl(url);
}

export function openUrl(url) {
  if (!/^http(s)?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  shell.openExternal(url);
}

// http://stackoverflow.com/a/6150060/172805
export function selectElementContents(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function setWindowSize(width, height, vibrancy) {
  currentWindow.setSize(width, height, false);
  if (typeof vibrancy !== 'undefined') {
    currentWindow.setVibrancy(vibrancy);
  }
}

export function isButtercupFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.bcup';
}

export function emitActionToParentAndClose(name, payload) {
  const win = remote.getCurrentWindow();
  const ipc = win.getParentWindow().webContents;
  ipc.send(name, payload);
  win.close();
}

export function closeCurrentWindow() {
  remote.getCurrentWindow().close();
}
