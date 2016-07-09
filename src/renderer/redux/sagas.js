import { takeLatest } from 'redux-saga';
import { createNewFileSaga, openFileSaga, NEW, OPEN } from './modules/files';

/**
 * Root Saga
 * listens to async actions and call appropriate generators
 */
export default function *rootSaga() {
  yield [
    takeLatest(NEW, createNewFileSaga),
    takeLatest(OPEN, openFileSaga)
  ];
}
