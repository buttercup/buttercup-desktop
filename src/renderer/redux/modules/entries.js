import { combineReducers } from 'redux';
import * as entryTools from '../../system/buttercup/entries';
import { GROUP_SELECTED } from './groups';

export const ENTRIES_LOADED = 'buttercup/entries/LOADED'; 
export const ENTRIES_SELECTED = 'buttercup/entries/SELECTED'; 

// Reducers ->

function byId(state = {}, action) {
  switch (action.type) {
    case ENTRIES_LOADED: {
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
    case ENTRIES_LOADED:
      return action.payload.map(entry => entry.id);
    default:
      return state;
  }
}

function currentEntry(state = null, action) {
  switch (action.type) {
    case ENTRIES_SELECTED:
      return action.payload;
    case GROUP_SELECTED:
      return null;
    default:
      return state;
  }
}

// Action Creators ->

export const loadEntries = groupId => dispatch => {
  const entries = entryTools.loadEntries(groupId);
  dispatch({
    type: ENTRIES_LOADED,
    payload: entries
  });
};

export const selectEntry = entryId => ({
  type: ENTRIES_SELECTED,
  payload: entryId
});

// Selectors ->

export const getCurrentEntries = state =>
  state.shownIds.map(id => state.byId[id]);

export const getCurrentEntry = state =>
  state.byId[state.currentEntry];

export default combineReducers({
  byId,
  shownIds,
  currentEntry
});
