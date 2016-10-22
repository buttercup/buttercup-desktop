import { getArchive } from './archive';

export function loadEntries(groupId) {
  const arch = getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  return group.getEntries().map(
    entry => entry.toObject()
  );
}
