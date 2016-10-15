import { combineReducers } from 'redux';
import recentFiles from './modules/recents';
import groups from './modules/groups';
import workspace from './modules/workspace';
import ui from './modules/ui';

export default combineReducers({
  workspace,
  recentFiles,
  groups,
  ui
});
