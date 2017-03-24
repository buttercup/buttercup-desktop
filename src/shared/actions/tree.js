import { TREE_ADD_EXPANDED_KEY, TREE_SET_EXPANDED_KEYS } from '../actions/types';

export const setExpandedKeys = keys => ({
  type: TREE_SET_EXPANDED_KEYS,
  payload: keys
});

export const addExpandedKey = key => ({
  type: TREE_ADD_EXPANDED_KEY,
  payload: key
});
