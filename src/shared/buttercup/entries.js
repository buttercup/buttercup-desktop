import { saveWorkspace, getArchive } from './archive';
import log from 'electron-log';
import i18n from '../i18n';
import iconographer from '../../main/lib/icon/iconographer';

function entryToObj(entry) {
  const obj = entry.toObject();
  return {
    ...obj,
    isInTrash: entry.isInTrash(),
    meta: Object.keys(obj.meta).map(metaKey => ({
      key: metaKey,
      value: obj.meta[metaKey]
    }))
  };
}

/**
 * Filter empty values
 * @param {ButtercupEntry} entry
 */
export function filterEmptyEntryValues(entry) {
  if (entry.meta) {
    entry.meta = entry.meta.filter(
      metaEntry => Object.keys(metaEntry).length !== 0 && metaEntry.key
    );
  }

  return entry;
}

/**
 * Validate buttercup entry values
 * @param {ButtercupEntry} entry
 */
export function validateEntry(entry) {
  const errorMessages = [];
  // Filter empty values

  if (!entry.properties) {
    errorMessages.push(i18n.t('entry.entry-inputs-empty-info'));
  } else {
    if (!entry.properties.title) {
      errorMessages.push(i18n.t('entry.entry-title-empty-info'));
    }

    if (
      (entry.meta || []).filter(metaEntry => !metaEntry.key && metaEntry.value)
        .length > 0
    ) {
      errorMessages.push(i18n.t('entry.custom-fields-label-empty-info'));
    }
  }

  if (errorMessages.length > 0) {
    throw new Error(errorMessages.join('\n'));
  }

  return filterEmptyEntryValues(entry);
}

export async function loadEntries(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  const entries = group.getEntries();

  return Promise.all(
    entries.map(async (entry, i) => {
      const entryObject = entryToObj(entry);
      // Here we get only the available icons in disk.
      // Downloading missing icons is a lot slower, we do it later, after loading the entries.
      const icon = await getIcon(entry);
      return {
        ...entryObject,
        icon: icon || null
      };
    })
  );
}

export async function updateEntry(archiveId, entryObj) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryObj.id);

  if (!entry) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  const entryData = validateEntry(entryObj);

  const properties = entryData.properties || {};
  const meta = entryData.meta || [];
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
    if (sourceMeta.hasOwnProperty(metaKey)) {
      // eslint-disable-line no-prototype-builtins
      const keys = meta.map(metaObj => metaObj.key);
      if (keys.indexOf(metaKey) === -1) {
        entry.deleteMeta(metaKey);
      }
    }
  }

  // Update/Add meta
  meta.forEach(metaObj => {
    const source = entry.getMeta(metaObj.key);
    if (
      source === undefined ||
      (source !== undefined && source !== metaObj.value)
    ) {
      entry.setMeta(metaObj.key, metaObj.value);
    }
  });

  // Save workspace
  saveWorkspace(archiveId);

  return entryToObj(entry);
}

export async function updateEntryIcon(archiveId, entryId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);

  if (!entry) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  const entryObj = entryToObj(entry);
  const icon = await getOrDownloadIcon(entry);
  if (icon) {
    entryObj.icon = icon;
  }

  return entryObj;
}

async function getOrDownloadIcon(entry) {
  // We move on whether this succeeds or not
  // TODO Should maybe log it somewhere (but not alert the user - not an error)
  let icon = await getIcon(entry);
  if (!icon) {
    await processIcon(entry);
    icon = await getIcon(entry);
  }
  return icon;
}

async function processIcon(entry) {
  try {
    await iconographer.processIconForEntry(entry);
  } catch (err) {
    // ENOTFOUND or ECONNREFUSED means the URL is just invalid, not an error
    if (!['ENOTFOUND', 'ECONNREFUSED'].includes(err.code)) {
      log.error('Unable to process icon for entry', err);
    }
  }
}

export async function getIcon(entry) {
  try {
    const iconContents = await iconographer.getIconForEntry(entry);
    if (iconContents) {
      return iconContents.toString();
    }
  } catch (err) {
    log.error('Unable to get icon for entry', err);
  }

  return null;
}

export function createEntry(archiveId, groupId, newValues) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  const entryData = validateEntry(newValues);
  const entry = group.createEntry(entryData.properties.title);

  ['username', 'password'].forEach(key => {
    if (typeof entryData.properties[key] !== 'undefined') {
      entry.setProperty(key, entryData.properties[key]);
    }
  });

  (entryData.meta || []).forEach(meta => {
    entry.setMeta(meta.key, meta.value);
  });

  saveWorkspace(archiveId);

  return entryToObj(entry);
}

export function deleteEntry(archiveId, entryId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);

  if (!entry) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  entry.delete();
  saveWorkspace(archiveId);
}

export function moveEntry(archiveId, entryId, groupId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);
  const group = arch.findGroupByID(groupId);

  if (!entry || !group) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  entry.moveToGroup(group);
  saveWorkspace(archiveId);
}
