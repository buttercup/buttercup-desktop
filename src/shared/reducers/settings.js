import uiReducer from './ui';
import {
  ARCHIVES_REMOVE,
  COLUMN_SIZE_SET,
  SETTING_SET
} from '../actions/types';

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
    const newState = { ...state };
    delete newState[action.payload];
    return newState;
  }
  return state;
}

const DEFAULT_SETTINGS = {
  columnSizes: { tree: 230, entries: 230 },
  condencedSidebar: true,
  menubarAutoHide: false,
  archivesLoading: false,
  isTrayIconEnabled: true,
  locale: ''
};

export function settings(state = DEFAULT_SETTINGS, action) {
  switch (action.type) {
    case COLUMN_SIZE_SET:
      return {
        ...state,
        columnSizes: {
          ...state.columnSizes,
          [action.payload.name]: action.payload.size
        }
      };
    case SETTING_SET:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      return state;
  }
}
