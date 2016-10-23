import Immutable from 'seamless-immutable';
import { GROUP_ADD_CHILD, GROUP_MOVE, GROUP_SELECTED } from './groups';

export const TREE_ADD_EXPANDED_KEY = 'buttercup/ui/TREE_ADD_EXPANDED_KEY';
export const TREE_SET_EXPANDED_KEYS = 'buttercup/ui/TREE_SET_EXPANDED_KEYS';
export const TREE_SET_SELECTED_KEYS = 'buttercup/ui/TREE_SET_SELECTED_KEYS';

const initialTreeState = Immutable({
  expandedKeys: [],
  selectedKeys: []
});

function addChild(state, groupId) {
  return state.updateIn(['expandedKeys'], keys => {
    const keys_ = keys.asMutable();
    keys_.push(groupId);
    return keys_;
  }, {deep: true});
}

export default function tree(state = initialTreeState, action) {
  switch (action.type) {
    case GROUP_ADD_CHILD:
    case GROUP_MOVE:
      return addChild(state, action.payload.parentId);
    case TREE_ADD_EXPANDED_KEY:
      return addChild(state, action.payload);
    case TREE_SET_EXPANDED_KEYS:
      return state.set('expandedKeys', action.payload);
    case GROUP_SELECTED:
    case TREE_SET_SELECTED_KEYS:
      return state.set('selectedKeys', Array.isArray(action.payload) ? action.payload : [action.payload]);
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

export const setSelectedKeys = keys => ({
  type: TREE_SET_SELECTED_KEYS,
  payload: keys
});
