import path from 'path';
import Fuse from 'fuse.js';
import { clipboard } from 'electron';

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
