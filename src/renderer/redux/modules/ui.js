import { combineReducers } from 'redux';
import treeReducer from './tree';

const UPDATE_AVAILABLE = 'buttercup/ui/UPDATE_AVAILABLE';
const UPDATE_INSTALL = 'buttercup/ui/UPDATE_INSTALL';

const initialState = {
  installing: false,
  available: false,
  version: null,
  notes: null
};

function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AVAILABLE:
      return {
        ...state,
        available: true,
        version: action.releaseName,
        notes: action.releaseNotes
      };
    case UPDATE_INSTALL:
      return {
        ...state,
        installing: true
      };
    default:
      return state;
  }
}

export const pushUpdate = updateObj => ({
  ...updateObj,
  type: UPDATE_AVAILABLE
});

export const installUpdate = () => dispatch => {
  dispatch({
    type: UPDATE_INSTALL
  });
  window.rpc.emit('quit-and-install');
};

export default combineReducers({
  tree: treeReducer,
  update
});
