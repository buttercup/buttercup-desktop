import uiReducer from './ui';
import { ARCHIVES_REMOVE } from '../actions/types';

function itemReducer(state = {}, action) {
  return {
    ui: uiReducer(state.ui, action)
  };
}

export default function archivesReducer(state = {}, action) {
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
