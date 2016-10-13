import { combineReducers } from 'redux';
import recentFiles from './modules/recents';
import groups from './modules/groups';
import workspace from './modules/workspace';

export default combineReducers({
  workspace,
  recentFiles,
  groups
});
