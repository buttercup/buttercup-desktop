import { newWorkspace, loadWorkspace } from '../../system/buttercup/archive';
import { addRecent } from './recents';
import { setWorkspace } from './workspace';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export const createNewFile = filename => dispatch => {
  return newWorkspace(filename, 'sallar').then(() => {
    return Promise.all([
      dispatch(setWorkspace(filename)),
      dispatch(addRecent(filename))
    ]);
  });
};

export const openFile = filename => dispatch => {
  return loadWorkspace(filename, 'sallar').then(() => {
    return Promise.all([
      dispatch(setWorkspace(filename)),
      dispatch(addRecent(filename))
    ]);
  });
};
