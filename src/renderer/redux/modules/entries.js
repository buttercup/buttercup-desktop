import { combineReducers } from 'redux';
import { initialize } from 'redux-form';
import deepAssign from 'deep-assign';
import * as entryTools from '../../system/buttercup/entries';
import { GROUP_SELECTED, getCurrentGroup } from './groups';

export const ENTRIES_LOADED = 'buttercup/entries/LOADED'; 
export const ENTRIES_SELECTED = 'buttercup/entries/SELECTED'; 
export const ENTRIES_UPDATE = 'buttercup/entries/UPDATE'; 
export const ENTRIES_CREATE_REQUEST = 'buttercup/entries/CREATE_REQUEST'; 
export const ENTRIES_CREATE = 'buttercup/entries/CREATE'; 
export const ENTRIES_DELETE = 'buttercup/entries/DELETE'; 

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
        [action.payload.id]: deepAssign(state[action.payload.id], action.payload)
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
    case 'redux-form/DESTROY':
      return null;
    default:
      return state;
  }
}

// Selectors ->

export const getCurrentEntries = state =>
  state.shownIds.map(id => state.byId[id]);

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
    dispatch(
      initialize(
        'editForm',
        getEntry(state, entryId)
      )
    );
  }
};

export const updateEntry = newValues => (dispatch, getState) => {
  const state = getState();
  const currentGroup = getCurrentGroup(state.groups); // @TODO: this should be object not string

  if (typeof newValues.id === 'string') {
    dispatch({
      type: ENTRIES_UPDATE,
      payload: newValues
    });
    entryTools.updateEntry(newValues);
  } else {
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
  }
};

export const deleteEntry = entryId => dispatch => {
  dispatch({
    type: ENTRIES_DELETE,
    payload: entryId
  });
  entryTools.deleteEntry(entryId);
};

export default combineReducers({
  byId,
  shownIds,
  currentEntry
});
