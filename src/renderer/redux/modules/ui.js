import { combineReducers } from 'redux';
import treeReducer from './tree';

export default combineReducers({
  tree: treeReducer
});
