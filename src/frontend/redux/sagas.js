import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';

function get() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random());
    }, 1);
  });
}

function *test() {
  const filename = yield get();
  yield put({type: 'buttercup/recents/ADD', filename});
}

export default function *rootSaga() {
  yield *takeLatest('ADD_REQUEST', test);
}
