import { newWorkspace, loadWorkspace } from '../../system/buttercup/archive';
import { addRecent } from './recents';
import { reloadGroups } from './groups';
import { setWorkspace } from './workspace';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export function createNewFile(filename) {
  return dispatch => {
    return newWorkspace(filename, 'sallar').then(workspace => {
      return Promise.all([
        dispatch(setWorkspace(workspace)),
        dispatch(addRecent(filename)),
        dispatch(reloadGroups())
      ]);
    });
  };
}

export function openFile(filename) {
  return dispatch => {
    return loadWorkspace(filename, 'sallar').then(workspace => {
      return Promise.all([
        dispatch(setWorkspace(workspace)),
        dispatch(addRecent(filename)),
        dispatch(reloadGroups())
      ]);
    });
  };
}
