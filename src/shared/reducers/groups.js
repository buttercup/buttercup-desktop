import { combineReducers } from 'redux';
import { deepAdd, deepFilter, deepMap, deepFindById, deepFindParentById } from '../utils/collection';
import {
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS,
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_REMOVE,
  GROUPS_RENAME,
  GROUPS_MOVE
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
    case GROUPS_DISMISS: {
      const newState = deepFilter(state, 'groups', group => !group.isNew);
      return deepMap(newState, 'groups', item => ({
        ...item,
        isRenaming: false
      }));
    }
    case GROUPS_MOVE: {
      let { groupId, parentId, gapDrop } = action.payload;
      const group = deepFindById(state, groupId, 'groups');
      const newState = deepFilter(state, 'groups', group => group.id !== groupId);
      if (gapDrop) {
        parentId = deepFindParentById(state, parentId, 'groups');
      }
      if (parentId === null) {
        return [
          ...newState,
          group
        ];
      }
      return deepMap(newState, 'groups', item => {
        if (item.id === parentId) {
          return {
            ...item,
            groups: [
              ...item.groups,
              group
            ]
          };
        }
        return item;
      });
    }
    case GROUPS_RESET:
      return action.payload;
    case GROUPS_REMOVE:
      return [];
    case GROUPS_RENAME:
      return deepMap(state, 'groups', item => {
        if (item.id === action.payload) {
          return {
            ...item,
            isRenaming: true
          };
        }
        return item;
      });
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
