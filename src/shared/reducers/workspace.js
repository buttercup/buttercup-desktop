import { combineReducers } from 'redux';
import { SET_WORKSPACE } from '../actions/types';

const initialState = {
  path: null,
  provider: 'filesystem' 
};

function archive(state = initialState, action) {
  switch (action.type) {
    case SET_WORKSPACE:
      return {
        ...state,
        path: action.payload.path,
        provider: action.payload.provider || 'filesystem'
      };
    default:
      return state;
  }
}

export default combineReducers({
  archive
});
