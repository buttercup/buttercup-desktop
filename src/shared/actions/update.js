import { createAction } from 'redux-actions';
import { UPDATE_AVAILABLE, UPDATE_INSTALL } from './types';

export const pushUpdate = createAction(UPDATE_AVAILABLE);
export const installUpdate = () => dispatch => {
  dispatch({
    type: UPDATE_INSTALL,
  });
  window.rpc.emit('quit-and-install');
};
