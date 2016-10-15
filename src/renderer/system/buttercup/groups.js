/**
 * Return recursive groups JSON structure
 * 
 * @export
 * @param {Buttercup.Workspace} workspace
 * @returns {Object} JSON structure
 */
export function getGroups(workspace) {
  const arch = workspace.getArchive();
  return arch.getGroups().map(
    group => group.toObject(Buttercup.ManagedGroup.OutputFlag.Groups)
  );
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

/**
 * Save group title
 * 
 * @export
 * @param {Buttercup.Workspace} workspace
 * @param {string} groupId
 * @param {string} title
 */
export function saveGroup(workspace, groupId, title) {
  const arch = workspace.getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  } 

  group.setTitle(title);
}

/**
 * Move group to another parent
 * 
 * @export
 * @param {Buttercup.Workspace} workspace
 * @param {string} groupId
 * @param {string} parentId
 */
export function moveGroup(workspace, groupId, parentId) {
  const arch = workspace.getArchive();
  const group = arch.getGroupByID(groupId);
  const parent = arch.getGroupByID(parentId);

  if (!group || !parent) {
    throw new Error('Group has not been found.');
  } 

  group.moveToGroup(parent);
}
