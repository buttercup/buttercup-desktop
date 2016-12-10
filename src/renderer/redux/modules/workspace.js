import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';
import { setWindowSize } from '../../system/utils';
import { reloadGroups } from './groups';

export const SET_WORKSPACE = 'buttercup/workspace/SET';

const initialState = Immutable({
  path: null,
  provider: 'filesystem' 
});

function archive(state = initialState, action) {
  switch (action.type) {
    case SET_WORKSPACE:
      return state.merge({
        path: action.payload.path,
        provider: action.payload.provider || 'filesystem'
      });
    default:
      return state;
  }
}

export const setWorkspace = archivePath => dispatch => {
  setWindowSize(950, 700, 'dark');

  dispatch({
    type: SET_WORKSPACE,
    payload: {
      path: archivePath
    }
  });
  dispatch(reloadGroups());
};

export default combineReducers({
  archive
});
