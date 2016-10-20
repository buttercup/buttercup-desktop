import { reloadGroups } from './groups';

export const SET_WORKSPACE = 'buttercup/workspace/SET';

export default function workspaceReducer(state = null, action) {
  switch (action.type) {
    case SET_WORKSPACE: 
      return action.payload;
    default:
      return state;
  }
}

export const setWorkspace = workspace => dispatch => {
  dispatch({
    type: SET_WORKSPACE,
    payload: workspace
  });
  dispatch(reloadGroups());
};
