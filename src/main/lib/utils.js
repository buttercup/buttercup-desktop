import path from 'path';
import os from 'os';

export function getPathToFile(fileName) {
  if (process.env.NODE_ENV === 'development') {
    return `file://${path.resolve(__dirname, `../../../app/${fileName}`)}`;
  }
  return `file://${path.resolve(__dirname, `./${fileName}`)}`;
}

export function getPathToUserPref(fileName) {
  return path.resolve(os.homedir(), '.buttercup/', fileName);
}
