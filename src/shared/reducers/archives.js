import uiReducer from './ui';

function itemReducer(state = {}, action) {
  return {
    ui: uiReducer(state.ui, action)
  };
}

export default function archivesReducer(state = {}, action) {
  const archiveId = (action.meta && action.meta.archiveId) || window.__ID__;
  if (archiveId) {
    return {
      ...state,
      [archiveId]: itemReducer(state[archiveId], action)
    };
  }
  return state;
}
