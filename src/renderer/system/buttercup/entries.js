import { getArchive } from './archive';

export function loadEntries(groupId) {
  const arch = getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  return group.getEntries().map(
    entry => {
      const obj = entry.toObject();
      return Object.assign(
        obj,
        {
          meta: Object.keys(obj.meta).map(metaKey => ({
            key: metaKey,
            value: obj.meta[metaKey]
          }))
        }
      );
    }
  );
}
