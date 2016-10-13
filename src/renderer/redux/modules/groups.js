import { call, put } from 'redux-saga/effects';

// Constants ->

const RESET = 'buttercup/groups/RESET';
const REMOVE = 'buttercup/groups/REMOVE';

// Reducers ->

export default function groupsReducer(state = [], action) {
  switch (action.type) {
    case RESET:
      return action.payload;
    case REMOVE:
      return [];
    default:
      return state;
  }
}

// Action Creators ->

export const resetGroups = groups => ({ type: RESET, payload: groups });
export const removeGroup = groupId => ({ type: REMOVE, id: groupId });

// Saga ->

/*export function *deleteGroupSaga(action) {
  const workspace = yield call(newWorkspace, action.filename, 'sallar');
  console.log('NEW!', workspace);
  yield put(addRecent(action.filename));
}
*/
