import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import recentFiles from './recents';
import groups from './groups';
import workspace from './workspace';
import entries from './entries';
import archives from './archives';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    archives
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
