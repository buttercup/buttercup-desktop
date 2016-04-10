import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
//import Api from '...'

// worker Saga : will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
   try {
      //const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: {name: "Sallar"}});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

/*
  starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action
  Allow concurrent fetches of user
*/
export function* mySaga() {
  yield* takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

/*
  Alternatively you may use takeLatest

  Do not allow concurrent fetches of user, If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run
*/
/*function* mySaga() {
  yield* takeLatest("USER_FETCH_REQUESTED", fetchUser);
}*/
