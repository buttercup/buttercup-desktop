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
  const arch = workspace.getArchive();
  const groupToObject = function(groups) {
    return groups.map(group => {
      const obj = group.toObject();
      const sub = group.getGroups();
      if (sub.length > 0) {
        obj.children = groupToObject(sub);
      }
      return obj;
    });
  };
  const res = groupToObject(arch.getGroups());
  console.log(JSON.stringify(res, undefined, 2));
  yield put(addRecent(action.filename));
}
