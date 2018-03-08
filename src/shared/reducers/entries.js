import { combineReducers } from 'redux';
import clone from 'lodash/cloneDeep';
import {
  GROUPS_SELECTED,
  ENTRIES_LOADED,
  ENTRIES_SELECTED,
  ENTRIES_UPDATE,
  ENTRIES_CREATE,
  ENTRIES_DELETE,
  ENTRIES_MOVE,
  ENTRIES_CHANGE_MODE,
  ENTRIES_SET_SORT
} from '../actions/types';

// Reducers ->

function byId(state = {}, action) {
  switch (action.type) {
    case ENTRIES_LOADED: {
      const nextState = { ...state };
      action.payload.forEach(entry => {
        nextState[entry.id] = entry;
      });
      return nextState;
    }
    case ENTRIES_UPDATE:
      return {
        ...state,
        [action.payload.id]: clone(action.payload)
      };
    case ENTRIES_CREATE:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    case ENTRIES_DELETE: {
      const nextState = { ...state };
      delete nextState[action.payload];
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
    case ENTRIES_CREATE:
      return [...state, action.payload.id];
    case ENTRIES_DELETE:
      return state.filter(id => id !== action.payload);
    case ENTRIES_MOVE:
      return state.filter(id => id !== action.payload.entryId);
    default:
      return state;
  }
}

function currentEntry(state = null, action) {
  switch (action.type) {
    case ENTRIES_SELECTED:
      return action.payload;
    case GROUPS_SELECTED:
    case ENTRIES_DELETE:
      return null;
    case ENTRIES_CHANGE_MODE:
      if (action.payload === 'new') {
        return null;
      }
      return state;
    default:
      return state;
  }
}

function mode(state = 'view', action) {
  switch (action.type) {
    case ENTRIES_CHANGE_MODE:
      if (['edit', 'view', 'new'].indexOf(action.payload) !== -1) {
        return action.payload;
      }
      return state;
    case ENTRIES_SELECTED:
      return 'view';
    default:
      return state;
  }
}

function sortMode(state = 'properties.title-asc', action) {
  switch (action.type) {
    case ENTRIES_SET_SORT:
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  shownIds,
  currentEntry,
  mode,
  sortMode
});
