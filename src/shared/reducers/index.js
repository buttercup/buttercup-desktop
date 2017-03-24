import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import groups from './groups';
import workspace from './workspace';
import entries from './entries';
import settingsByArchiveId from './settings';
import archives from './archives';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    settingsByArchiveId,
    archives,
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers,
      workspace,
      groups,
      entries,
      form,
    };
  }

  return combineReducers({ ...reducers });
}
