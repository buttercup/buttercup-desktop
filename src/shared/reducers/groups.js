import { combineReducers } from 'redux';
import { deepAdd, deepFilter } from '../utils/collection';

import {
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS_NEW_CHILD,
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
    case GROUPS_ADD_NEW_CHILD:
      return deepAdd(state, action.payload, 'groups', {
        id: Math.random().toString(),
        parentId: action.payload,
        title: '',
        isNew: true
      });
    case GROUPS_DISMISS_NEW_CHILD:
      return deepFilter(state, 'groups', group => !group.isNew);
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

export default combineReducers({
  byId: groups,
  currentGroup,
  sortMode
});
