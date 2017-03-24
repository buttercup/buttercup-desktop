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

export const createIdentityReducer = (type, initialState) => (store = initialState, action) => {
  switch (action.type) {
    case type:
      return action.payload;
    default:
      return store;
  }
};
