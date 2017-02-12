import { GROUP_ADD_CHILD, GROUP_MOVE } from './groups';

export const TREE_ADD_EXPANDED_KEY = 'buttercup/ui/TREE_ADD_EXPANDED_KEY';
export const TREE_SET_EXPANDED_KEYS = 'buttercup/ui/TREE_SET_EXPANDED_KEYS';

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
    case GROUP_ADD_CHILD:
    case GROUP_MOVE:
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

export const setExpandedKeys = keys => ({
  type: TREE_SET_EXPANDED_KEYS,
  payload: keys
});

export const addExpandedKey = key => ({
  type: TREE_ADD_EXPANDED_KEY,
  payload: key
});
