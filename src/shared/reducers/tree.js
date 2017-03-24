import {
  GROUPS_ADD_CHILD,
  GROUPS_MOVE,
  TREE_ADD_EXPANDED_KEY,
  TREE_SET_EXPANDED_KEYS,
} from '../actions/types';

const initialTreeState = {
  expandedKeys: []
};

function addChild(state, groupId) {
  return {
    ...state,
    expandedKeys: [
      ...state.expandedKeys,
      groupId
    ]
  };
}

export default function tree(state = initialTreeState, action) {
  switch (action.type) {
    case GROUPS_ADD_CHILD:
    case GROUPS_MOVE:
      return addChild(state, action.payload.parentId);
    case TREE_ADD_EXPANDED_KEY:
      return addChild(state, action.payload);
    case TREE_SET_EXPANDED_KEYS:
      return {
        ...state,
        expandedKeys: action.payload
      };
    default:
      return state;
  }
}
