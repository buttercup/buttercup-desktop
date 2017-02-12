import path from 'path';
import { clipboard, remote } from 'electron';
import Fuse from 'fuse.js';

const currentWindow = remote.getCurrentWindow();

export function filterByText(list, filterText) {
  if (filterText === '' || !filterText) {
    return list;
  }
  
  const fuse = new Fuse(list, {
    keys: ['properties.title', 'properties.username']
  });
  return fuse.search(filterText);
}

export function copyToClipboard(text) {
  clipboard.writeText(text);
} 

// http://stackoverflow.com/a/6150060/172805
export function selectElementContents(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function parsePath(filepath) {
  return path.parse(filepath);
}

export function setWindowSize(width, height, vibrancy) {
  currentWindow.setSize(width, height, false);
  if (typeof vibrancy !== 'undefined') {
    currentWindow.setVibrancy(vibrancy);
  }
}

export function isOSX() {
  return process.platform === 'darwin';
}

export function isWindows() {
  return process.platform === 'win32';
}

export function isLinux() {
  return process.platform === 'linux';
}
