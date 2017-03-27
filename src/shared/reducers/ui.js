import { combineReducers } from 'redux';
import { createIdentityReducer } from '../utils/redux';
import {
  GROUPS_ADD_CHILD,
  GROUPS_MOVE,
  TREE_ADD_EXPANDED_KEY,
  TREE_SET_EXPANDED_KEYS,
  COLUMN_SIZE_SET,
  WINDOW_SIZE_SET,
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

function columnSizes(state = {tree: 230, entries: 230}, action) {
  if (!action.payload || !action.payload.name || !action.payload.size) {
    return state;
  }
  switch (action.type) {
    case COLUMN_SIZE_SET:
      return {
        ...state,
        [action.payload.name]: action.payload.size
      };
    default:
      return state;
  }
}

export const windowSize = createIdentityReducer(
  WINDOW_SIZE_SET,
  [950, 700]
);

export default combineReducers({
  treeExpandedKeys,
  columnSizes,
  windowSize
});
