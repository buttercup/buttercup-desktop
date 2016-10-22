import { newWorkspace, loadWorkspace } from '../../system/buttercup/archive';
import { setWorkspace } from './workspace';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export const createNewFile = filename => dispatch => {
  return newWorkspace(filename, 'sallar').then(() => {
    dispatch(setWorkspace(filename));
  });
};

export const openFile = filename => dispatch => {
  return loadWorkspace(filename, 'sallar').then(() => {
    dispatch(setWorkspace(filename));
  });
};
