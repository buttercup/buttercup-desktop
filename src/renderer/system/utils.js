import path from 'path';
import Fuse from 'fuse.js';
import { clipboard, remote } from 'electron';

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

export function parsePath(filepath) {
  return path.parse(filepath);
}

export function setWindowSize(width, height) {
  currentWindow.setSize(width, height, false);
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
