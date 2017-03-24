import { combineReducers } from 'redux';
import { sortRecursivelyByKey } from '../utils/collection';

import {
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_REMOVE
} from '../actions/types';

// Reducers ->

function currentGroup(state = null, action) {
  switch (action.type) {
    case GROUPS_SELECTED:
      return action.payload;
    default:
      return state;
  }
}

function groups(state = [], action) {
  switch (action.type) {
    case GROUPS_RESET:
      return action.payload;
    case GROUPS_REMOVE:
      return [];
    default:
      return state;
  }
}

function sortMode(state = 'title-asc', action) {
  switch (action.type) {
    case GROUPS_SET_SORT:
      return action.payload;
    default:
      return state;
  }
}

// Selectors -> 

export const getGroups = state => {
  const trashGroups = state.byId.filter(g => g.isTrash);
  const rest = state.byId.filter(g => !g.isTrash);
  return [
    ...sortRecursivelyByKey(rest, state.sortMode, 'groups'),
    ...trashGroups
  ];
};

export const getCurrentGroup = state =>
  state.currentGroup;

export default combineReducers({
  byId: groups,
  currentGroup,
  sortMode
});
