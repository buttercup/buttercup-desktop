import { saveWorkspace as save, getArchive } from './archive';

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

export function updateEntry(entryObj) {
  const arch = getArchive();
  const entry = arch.getEntryByID(entryObj.id);

  if (!entry) {
    throw new Error('Entry has not been found');
  }

  const properties = entryObj.properties || {};
  const meta = entryObj.meta || [];
  const sourceMeta = entry.toObject().meta || {};

  // Update properties
  for (const propertyKey in properties) {
    if (
      properties.hasOwnProperty(propertyKey) && // eslint-disable-line no-prototype-builtins
      entry.getProperty(propertyKey) !== properties[propertyKey]
    ) {
      entry.setProperty(propertyKey, properties[propertyKey]);
    }
  }

  // Remove Meta
  for (const metaKey in sourceMeta) {
    if (sourceMeta.hasOwnProperty(metaKey)) { // eslint-disable-line no-prototype-builtins
      const keys = meta.map(metaObj => metaObj.key);
      if (keys.indexOf(metaKey) === -1) {
        entry.deleteMeta(metaKey);
      }
    }
  }

  // Update/Add meta
  meta.forEach(metaObj => {
    const source = entry.getMeta(metaObj.key);
    if (source === undefined || (source !== undefined && source !== metaObj.value)) {
      entry.setMeta(metaObj.key, metaObj.value);
    }
  });

  // Save workspace
  save();
}
