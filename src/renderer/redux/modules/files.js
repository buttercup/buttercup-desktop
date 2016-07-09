import { put } from 'redux-saga/effects';
import { addRecent } from './recents';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export function createNewFile() {
  return { type: NEW };
}

export function openFile() {
  return { type: OPEN };
}

// Sagas ->

export function *createNewFileSaga() {
  yield put(addRecent(Math.random()));
}

export function *openFileSaga() {
  yield put(addRecent(Math.random()));
}
