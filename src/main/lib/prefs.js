import fs from 'fs-extra';
import { getPathToUserPref } from './utils';

export function loadStateFromDisk() {
  try {
    return fs.readJsonSync(getPathToUserPref('state.json'));
  } catch (err) {
    return {};
  }
}

export function saveStateToDisk(stateJson) {
  const filePath = getPathToUserPref('state.json');
  fs.ensureFile(filePath, err => {
    if (!err) {
      fs.writeJson(filePath, stateJson, err => {
        if (err) {
          console.log('Error writing file to disk.');
        }
      });
    }
  });
}
