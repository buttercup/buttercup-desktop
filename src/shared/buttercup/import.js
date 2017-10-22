import { Archive } from 'buttercup/dist/buttercup-web.min';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { getArchive, saveWorkspace } from './archive';
import { ImportTypeInfo } from './types';

export function importHistory(archiveId, history) {
  const tempArchive = Archive.createFromHistory(history);
  const mainArchive = getArchive(archiveId);

  tempArchive.getGroups().forEach(group => {
    group.moveTo(mainArchive);
  });

  saveWorkspace(archiveId);
}

export function showHistoryPasswordPrompt(type) {
  const typeInfo = ImportTypeInfo[type];
  return showPasswordDialog(null, {
    title: `${typeInfo.name} Archive Password`,
    confirmButtonText: `Import ${typeInfo.name} Archive`,
    cancelButtonText: 'Cancel Import'
  });
}
