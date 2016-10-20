import { combineReducers } from 'redux';
import recentFiles from './modules/recents';
import groups from './modules/groups';
import workspace from './modules/workspace';
import ui from './modules/ui';
import entries from './modules/entries';

export default combineReducers({
  workspace,
  recentFiles,
  groups,
  ui,
  entries
});
