import { getCurrentArchiveId } from '../selectors';

export const createLocalAction = type => payload => (dispatch, getState) => {
  dispatch({
    type,
    payload,
    meta: {
      archiveId: getCurrentArchiveId(getState())
    }
  });
};
