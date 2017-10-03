import { combineReducers } from 'redux';
import {
  TREE_ADD_EXPANDED_KEY,
  TREE_SET_EXPANDED_KEYS
} from '../actions/types';

function treeExpandedKeys(state = [], action) {
  switch (action.type) {
    case TREE_ADD_EXPANDED_KEY:
      return [...state, action.payload];
    case TREE_SET_EXPANDED_KEYS:
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  treeExpandedKeys
});
