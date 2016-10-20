import { combineReducers } from 'redux';
import * as entryTools from '../../system/buttercup/entries';

export const LOADED = 'buttercup/entries/LOADED'; 

// Reducers ->

function byId(state = {}, action) {
  switch (action.type) {
    case LOADED: {
      const nextState = {...state};
      action.payload.forEach(entry => {
        nextState[entry.id] = entry;
      });
      return nextState;
    }
    default:
      return state;
  }
}

function shownIds(state = [], action) {
  switch (action.type) {
    case LOADED:
      return action.payload.map(entry => entry.id);
    default:
      return state;
  }
}

// Action Creators ->

export const loadEntries = groupId => (dispatch, getState) => {
  const { workspace } = getState();
  const entries = entryTools.loadEntries(workspace, groupId);
  dispatch({
    type: LOADED,
    payload: entries
  });
};

// Selectors ->

export const getCurrentEntries = state =>
  state.shownIds.map(id => state.byId[id]);

export default combineReducers({
  byId,
  shownIds
});
