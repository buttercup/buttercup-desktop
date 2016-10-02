import { combineReducers } from 'redux';
import recentFiles from './modules/recents';
import groups from './modules/groups';

export default combineReducers({
  recentFiles,
  groups
});
