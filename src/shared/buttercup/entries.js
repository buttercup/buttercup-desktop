import omit from 'lodash/omit';
import i18n from '../i18n';
import { getArchive, saveWorkspace } from './archive';
import { Archive, entryFacade, tools as buttercupTools } from './buttercup';

const { consumeEntryFacade, createEntryFacade } = entryFacade;
const { getEntryFacadeURLs, ENTRY_URL_TYPE_ANY } = buttercupTools.entry;

function entryToObj(entry) {
  const facade = createEntryFacade(entry);
  return {
    id: entry.id,
    facade,
    isInTrash: entry.isInTrash()
  };
}

export function getFacadeFieldValue(entry, fieldName) {
  const field = entry.facade.fields.find(
    field => field.property === fieldName && field.field === 'property'
  );
  if (field) {
    return field.value;
  }
}

export function getEntryURL(entry) {
  const [url] = entry.facade
    ? getEntryFacadeURLs(entry.facade, ENTRY_URL_TYPE_ANY)
    : entry.getURLs([ENTRY_URL_TYPE_ANY]);
  return url;
}

export function getParentGroups(currentGroup) {
  return currentGroup
    ? [...getParentGroups(currentGroup.getGroup()), currentGroup]
    : [];
}

/**
 * Validate buttercup entry values
 * @param {ButtercupEntry} entry
 */
export function validateEntry(entry) {
  const errorMessages = [];
  const fields = entry.facade.fields;

  if (!Array.isArray(fields) || fields.length === 0) {
    errorMessages.push(i18n.t('entry.entry-inputs-empty-info'));
  } else {
    const title = getFacadeFieldValue(entry, 'title');

    if (!title) {
      errorMessages.push(i18n.t('entry.entry-title-empty-info'));
    }

    if (fields.filter(field => !field.property).length > 0) {
      errorMessages.push(i18n.t('entry.custom-fields-label-empty-info'));
    }
  }

  if (errorMessages.length > 0) {
    throw new Error(errorMessages.join('\n'));
  }

  return entry;
}

// @TODO: Add entry type when we take facades into use
export function createNewEntryStructure() {
  const archive = new Archive();
  const group = archive.createGroup('temp');
  const entry = entryToObj(group.createEntry());
  return omit(entry, 'id');
}

export function loadEntries(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  const entries = group.getEntries();
  return entries.map(entry => entryToObj(entry));
}

export function updateEntry(archiveId, entryObj) {
  const arch = getArchive(archiveId);
  const entry = arch.findEntryByID(entryObj.id);

  if (!entry) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  const { facade } = validateEntry(entryObj);

  consumeEntryFacade(entry, facade);
  saveWorkspace(archiveId);

  return entryToObj(entry);
}

export function createEntry(archiveId, groupId, newValues) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  const { facade } = validateEntry(newValues);
  const entry = group.createEntry();

  consumeEntryFacade(entry, facade);
  saveWorkspace(archiveId);

  return entryToObj(entry);
}

export function deleteEntry(archiveId, entryId) {
  const arch = getArchive(archiveId);
  const entry = arch.findEntryByID(entryId);

  if (!entry) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  entry.delete();
  saveWorkspace(archiveId);
}

export function moveEntry(archiveId, entryId, groupId) {
  const arch = getArchive(archiveId);
  const entry = arch.findEntryByID(entryId);
  const group = arch.findGroupByID(groupId);

  if (!entry || !group) {
    throw new Error(i18n.t('error.entry-not-found'));
  }

  entry.moveToGroup(group);
  saveWorkspace(archiveId);
}
