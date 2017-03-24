import { combineReducers } from 'redux';
import {
  UPDATE_AVAILABLE,
  UPDATE_INSTALL,
  GROUPS_ADD_CHILD,
  GROUPS_MOVE,
  TREE_ADD_EXPANDED_KEY,
  TREE_SET_EXPANDED_KEYS,
} from '../actions/types';

function treeExpandedKeys(state = [], action) {
  switch (action.type) {
    case GROUPS_ADD_CHILD:
    case GROUPS_MOVE:
      return [
        ...state,
        action.payload.parentId
      ];
    case TREE_ADD_EXPANDED_KEY:
      return [
        ...state,
        action.payload
      ];
    case TREE_SET_EXPANDED_KEYS:
      return action.payload;
    default:
      return state;
  }
}

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
  treeExpandedKeys,
  update
});
