import { Archive } from './buttercup';
import { getArchive, saveWorkspace } from './archive';

export function importHistory(archiveId, history) {
  const tempArchive = Archive.createFromHistory(history);
  const mainArchive = getArchive(archiveId);

  tempArchive.getGroups().forEach(group => {
    group.moveTo(mainArchive);
  });

  saveWorkspace(archiveId);
}
