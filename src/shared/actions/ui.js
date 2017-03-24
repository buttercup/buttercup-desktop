import {
  UPDATE_AVAILABLE,
  UPDATE_INSTALL,
  TREE_ADD_EXPANDED_KEY,
  TREE_SET_EXPANDED_KEYS
} from './types';

export const pushUpdate = updateObj => ({
  ...updateObj,
  type: UPDATE_AVAILABLE
});

export const installUpdate = () => dispatch => {
  dispatch({
    type: UPDATE_INSTALL
  });
  window.rpc.emit('quit-and-install');
};

export const setExpandedKeys = keys => ({
  type: TREE_SET_EXPANDED_KEYS,
  payload: keys
});

export const addExpandedKey = key => ({
  type: TREE_ADD_EXPANDED_KEY,
  payload: key
});
