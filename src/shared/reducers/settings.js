import { combineReducers } from 'redux';
import uiReducer from './ui';
import { createIdentityReducer } from '../utils/redux';
import { ARCHIVES_REMOVE, COLUMN_SIZE_SET, WINDOW_SIZE_SET } from '../actions/types';

function itemReducer(state = {}, action) {
  return {
    ui: uiReducer(state.ui, action)
  };
}

export function settingsByArchiveId(state = {}, action) {
  const archiveId = action.meta && action.meta.archiveId;
  if (archiveId) {
    return {
      ...state,
      [archiveId]: itemReducer(state[archiveId], action)
    };
  }
  if (action.type === ARCHIVES_REMOVE && state[action.payload]) {
    const newState = {...state};
    delete newState[action.payload];
    return newState;
  }
  return state;
}

function columnSizes(state = { tree: 230, entries: 230 }, action) {
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

const windowSize = createIdentityReducer(
  WINDOW_SIZE_SET,
  [950, 700]
);

export const settings = combineReducers({
  columnSizes,
  windowSize
});
