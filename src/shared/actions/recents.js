import { showConfirmDialog } from '../../renderer/system/dialog';

import {
  RECENTS_ADD,
  RECENTS_REMOVE,
  RECENTS_CLEAR
} from './types';

export const addRecent = filename => ({ type: RECENTS_ADD, filename });
export const removeRecent = filename => ({ type: RECENTS_REMOVE, filename });
export const clearRecent = () => dispatch => {
  showConfirmDialog('Are you sure you want to clear the history?', resp => {
    if (resp === 0) {
      dispatch({ type: RECENTS_CLEAR });
    }
  });
};
