import { put } from 'redux-saga/effects';
import { showOpenDialog, showSaveDialog } from '../../system/dialog';
import { addRecent } from './recents';

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
    yield put(addRecent(filename));
  }
}

export function *openFileSaga() {
  const filename = showOpenDialog();
  if (filename) {
    yield put(addRecent(filename));
  }
}
