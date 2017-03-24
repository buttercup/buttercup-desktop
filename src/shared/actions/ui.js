import { createLocalAction } from '../utils/redux';
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

export const setExpandedKeys = createLocalAction(TREE_SET_EXPANDED_KEYS);
export const addExpandedKeys = createLocalAction(TREE_ADD_EXPANDED_KEY);
