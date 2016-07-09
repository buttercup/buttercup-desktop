import { put } from 'redux-saga/effects';
import { showOpenDialog } from '../../system/dialog';
import { addRecent } from './recents';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export const createNewFile = () => ({ type: NEW });
export const openFile = () => ({ type: OPEN });

// Sagas ->

export function *createNewFileSaga() {
  yield put(addRecent(Math.random()));
}

export function *openFileSaga() {
  const filename = showOpenDialog();
  yield put(addRecent(filename[0]));
}
