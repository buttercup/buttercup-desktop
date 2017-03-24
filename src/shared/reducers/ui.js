import { combineReducers } from 'redux';
import { UPDATE_AVAILABLE, UPDATE_INSTALL } from '../actions/types';
import treeReducer from './tree';

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

export default combineReducers({
  tree: treeReducer,
  update
});
