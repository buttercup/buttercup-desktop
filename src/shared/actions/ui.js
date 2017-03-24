import { UPDATE_AVAILABLE, UPDATE_INSTALL } from './types';

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
