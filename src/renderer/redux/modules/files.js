import { call, put } from 'redux-saga/effects';
import { newWorkspace, loadWorkspace } from '../../system/buttercup/archive';
import { addRecent } from './recents';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export const createNewFile = filename => ({ type: NEW, filename });
export const openFile = filename => ({ type: OPEN, filename });

// Sagas ->

export function *createNewFileSaga(action) {
  const workspace = yield call(newWorkspace, action.filename, 'sallar');
  console.log('NEW!', workspace);
  yield put(addRecent(action.filename));
}

export function *openFileSaga(action) {
  const workspace = yield call(loadWorkspace, action.filename, 'sallar');
  console.log('LOADED!', workspace);
  yield put(addRecent(action.filename));
}
