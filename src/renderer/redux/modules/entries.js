import { combineReducers } from 'redux';
import clone from 'lodash/cloneDeep';
import * as entryTools from '../../system/buttercup/entries';
import { filterByText, sortByKey } from '../../system/utils';
import { showConfirmDialog } from '../../system/dialog';
import { GROUP_SELECTED, getCurrentGroup } from './groups';

export const ENTRIES_LOADED = 'buttercup/entries/LOADED';
export const ENTRIES_SELECTED = 'buttercup/entries/SELECTED'; 
export const ENTRIES_UPDATE = 'buttercup/entries/UPDATE';
export const ENTRIES_CREATE_REQUEST = 'buttercup/entries/CREATE_REQUEST'; 
export const ENTRIES_CREATE = 'buttercup/entries/CREATE';
export const ENTRIES_DELETE = 'buttercup/entries/DELETE';
export const ENTRIES_MOVE = 'buttercup/entries/MOVE';
export const ENTRIES_CHANGE_MODE = 'buttercup/entries/CHANGE_MODE'; 
export const ENTRIES_SET_FILTER = 'buttercup/entries/SET_FILTER';
export const ENTRIES_SET_SORT = 'buttercup/entries/SET_SORT';

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
      const nextState = {...state};
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
    case GROUP_SELECTED:
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

function filter(state = '', action) {
  switch (action.type) {
    case ENTRIES_SET_FILTER:
      return action.payload;
    case GROUP_SELECTED:
      return state;
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

// Selectors ->

export const getCurrentEntries = state => {
  const { filter, sortMode } = state;
  const mapped = state.shownIds.map(id => state.byId[id]);
  if (filter && filter.length > 0) {
    return filterByText(mapped, filter);
  }

  return sortByKey(mapped, sortMode);
};

export const getCurrentEntry = state =>
  state.byId[state.currentEntry];

export const getEntry = (state, entryId) =>
  state.byId[entryId];

// Action Creators ->

export const loadEntries = groupId => dispatch => {
  const entries = entryTools.loadEntries(groupId);
  dispatch({
    type: ENTRIES_LOADED,
    payload: entries
  });
};

export const selectEntry = entryId => (dispatch, getState) => {
  const state = getState().entries;
  const currentEntry = getCurrentEntry(state); 
  if (!currentEntry || currentEntry.id !== entryId) {
    dispatch({
      type: ENTRIES_SELECTED,
      payload: entryId
    });
  }
};

export const changeMode = mode => () => ({
  type: ENTRIES_CHANGE_MODE,
  payload: mode
});

export const updateEntry = newValues => dispatch => {
  dispatch({
    type: ENTRIES_UPDATE,
    payload: newValues
  });
  entryTools.updateEntry(newValues);
  dispatch(changeMode('view')());
};

export const newEntry = newValues => (dispatch, getState) => {
  const state = getState();
  const currentGroup = getCurrentGroup(state.groups); // @TODO: this should be object not string

  if (currentGroup === null) {
    return null;
  }
  dispatch({
    type: ENTRIES_CREATE_REQUEST,
    payload: newValues
  });
  entryTools.createEntry(newValues, currentGroup).then(entryObj => {
    dispatch({
      type: ENTRIES_CREATE,
      payload: entryObj
    });
    dispatch(selectEntry(entryObj.id));
  }).catch(err => {
    console.error(err);
  });
};

export const moveEntry = (entryId, groupId) => dispatch => {
  dispatch({
    type: ENTRIES_MOVE,
    payload: {
      entryId,
      groupId
    }
  });
  entryTools.moveEntry(entryId, groupId);
};

export const deleteEntry = entryId => dispatch => {
  showConfirmDialog('Are you sure?', resp => {
    if (resp === 0) {
      dispatch({
        type: ENTRIES_DELETE,
        payload: entryId
      });
      entryTools.deleteEntry(entryId);
    }
  });
};

export const setFilter = filter => ({
  type: ENTRIES_SET_FILTER,
  payload: filter
});

export const setSortMode = sortKey => ({
  type: ENTRIES_SET_SORT,
  payload: sortKey
});

export default combineReducers({
  byId,
  shownIds,
  currentEntry,
  mode,
  filter,
  sortMode
});
