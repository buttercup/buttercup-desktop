// Constants ->

const RESET = 'buttercup/groups/RESET';
const REMOVE = 'buttercup/groups/REMOVE';

// Reducers ->

export default function groupsReducer(state = [], action) {
  switch (action.type) {
    case RESET:
      return action.payload;
    case REMOVE:
      return [];
    default:
      return state;
  }
}

// Action Creators ->

export const resetGroups = groups => ({ type: RESET, payload: groups });
export const removeGroup = groupId => ({ type: REMOVE, id: groupId });

export function reloadGroups() {
  return (dispatch, getState) => {
    const { workspace } = getState();
    if (!workspace) {
      return null;
    }
    const arch = workspace.getArchive();
    const groupToObject = function(groups) {
      return groups.map(group => {
        const obj = group.toObject();
        const sub = group.getGroups();
        obj.children = [];
        if (sub.length > 0) {
          obj.children = groupToObject(sub);
        }
        obj.name = obj.title;
        return obj;
      });
    };
    const res = groupToObject(arch.getGroups());
    dispatch(resetGroups(res));
  };
}
