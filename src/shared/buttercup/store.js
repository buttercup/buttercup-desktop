import { getSharedArchiveManager } from './archive';
import { resetArchivesInStore } from '../actions/archives.js';
import { setSetting } from '../actions/settings';

export function linkArchiveManagerToStore(store) {
  const archiveManager = getSharedArchiveManager();

  archiveManager.on('sourcesUpdated', function __handleUpdatedSources(sources) {
    store.dispatch(setSetting('archivesLoading', false));
    store.dispatch(resetArchivesInStore(sources));
  });

  // rehydrate
  archiveManager.rehydrate();
}
