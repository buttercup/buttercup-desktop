import { put } from 'redux-saga/effects';
import { showOpenDialog, showSaveDialog } from '../../system/dialog';
import { addRecent } from './recents';
import { newWorkspace, loadWorkspace } from '../../system/buttercup/archive';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export const createNewFile = () => ({ type: NEW });
export const openFile = () => ({ type: OPEN });

// Sagas ->

export function *createNewFileSaga() {
  const filename = showSaveDialog();

  if (filename) {
    const workspace = yield newWorkspace(filename, 'sallar');
    console.log('NEW!', workspace);
    yield put(addRecent(filename));
  }
}

export function *openFileSaga() {
  const filename = showOpenDialog();
  if (filename) {
    const workspace = yield loadWorkspace(filename, 'sallar');
    console.log('LOADED!', workspace);
    yield put(addRecent(filename));
  }
}
