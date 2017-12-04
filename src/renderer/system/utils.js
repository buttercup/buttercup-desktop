import path from 'path';
import { clipboard, remote, shell } from 'electron';

const currentWindow = remote.getCurrentWindow();

export function copyToClipboard(text) {
  clipboard.writeText(text);
}

export function readClipboard() {
  return clipboard.readText();
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
