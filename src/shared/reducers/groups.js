import { combineReducers } from 'redux';
import {
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS,
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_RENAME,
  GROUPS_MOVE,
  GROUPS_UPDATE
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

function byId(state = {}, action) {
  switch (action.type) {
    case GROUPS_ADD_NEW_CHILD: {
      const { group, parentId } = action.payload;
      let newState = { ...state };
      if (parentId !== null) {
        newState = {
          ...newState,
          [parentId]: {
            ...newState[parentId],
            groups: [...newState[parentId].groups, group.id]
          }
        };
      }
      return {
        ...newState,
        [group.id]: group
      };
    }
    case GROUPS_DISMISS:
      return Object.keys(state).reduce((newState, id) => {
        if (id === action.payload) {
          return newState;
        }
        newState[id] = {
          ...state[id],
          groups: state[id].groups.filter(groupId => groupId !== action.payload)
        };
        return newState;
      }, {});
    case GROUPS_MOVE: {
      const { groupId, fromParentId, toParentId } = action.payload;

      if (toParentId === fromParentId) {
        return state;
      }

      let newState = { ...state };

      if (fromParentId) {
        newState = {
          ...newState,
          [fromParentId]: {
            ...newState[fromParentId],
            groups: newState[fromParentId].groups.filter(id => id !== groupId)
          }
        };
      }

      if (toParentId) {
        newState = {
          ...newState,
          [toParentId]: {
            ...newState[toParentId],
            groups: [...newState[toParentId].groups, groupId]
          }
        };
      }

      return newState;
    }
    case GROUPS_RESET:
      return action.payload.entities.groups;
    case GROUPS_RENAME:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isRenaming: true
        }
      };
    case GROUPS_UPDATE:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    default:
      return state;
  }
}

function shownIds(state = [], action) {
  switch (action.type) {
    case GROUPS_ADD_NEW_CHILD:
      if (!action.payload.parentId) {
        return [...state, action.payload.group.id];
      }
      return state;
    case GROUPS_MOVE: {
      const { groupId, fromParentId, toParentId } = action.payload;

      if (toParentId === fromParentId) {
        return state;
      }

      if (!fromParentId) {
        return state.filter(id => id !== groupId);
      }
      if (!toParentId) {
        return [...state, groupId];
      }
      return state;
    }
    case GROUPS_DISMISS:
      return state.filter(id => id !== action.payload);
    case GROUPS_RESET:
      return action.payload.result;
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
  byId,
  shownIds,
  currentGroup,
  sortMode
});
