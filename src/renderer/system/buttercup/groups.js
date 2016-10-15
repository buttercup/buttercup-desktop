/**
 * Return recursive groups JSON structure
 * 
 * @export
 * @param {Buttercup.Workspace} workspace
 * @returns {Object} JSON structure
 */
export function getGroups(workspace) {
  const arch = workspace.getArchive();
  const groupToObject = function(groups) {
    return groups.map(group => {
      const obj = group.toObject();
      const sub = group.getGroups();
      obj.children = groupToObject(sub);
      return obj;
    });
  };
  return groupToObject(arch.getGroups());
}

/**
 * Create a new group under a parent group
 * 
 * @export
 * @param {Buttercup.Workspace} workspace
 * @param {string} parentId
 * @param {string} groupName
 */
export function createGroup(workspace, parentId, groupName) {
  const arch = workspace.getArchive();
  const group = arch.getGroupByID(parentId);

  if (!group) {
    throw new Error('Group has not been found.');
  }
  
  group.createGroup(groupName);
}

/**
 * Delete a group
 * 
 * @export
 * @param {Buttercup.Workspace} workspace
 * @param {string} groupId
 */
export function deleteGroup(workspace, groupId) {
  const arch = workspace.getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  } 

  group.delete();
}

export function saveGroup(workspace, groupId, title) {
  const arch = workspace.getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  } 

  group.setTitle(title);
}

export function moveGroup(workspace, groupId, parentId) {
  const arch = workspace.getArchive();
  const group = arch.getGroupByID(groupId);
  const parent = arch.getGroupByID(parentId);

  if (!group || !parent) {
    throw new Error('Group has not been found.');
  } 

  group.moveToGroup(parent);
}
