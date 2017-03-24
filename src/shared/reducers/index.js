import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import recentFiles from './recents';
import groups from './groups';
import workspace from './workspace';
import entries from './entries';
import settingsByArchiveKey from './settings';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    settingsByArchiveKey
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers,
      workspace,
      recentFiles,
      groups,
      entries,
      form,
    };
  }

  return combineReducers({ ...reducers });
}
