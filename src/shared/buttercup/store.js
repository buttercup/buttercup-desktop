import { getSharedArchiveManager } from './archive';
import { resetArchivesInStore } from '../actions/archives.js';

export function linkArchiveManagerToStore(store) {
  const archiveManager = getSharedArchiveManager();

  archiveManager.on('sourcesUpdated', function __handleUpdatedSources(sources) {
    store.dispatch(resetArchivesInStore(sources));
  });

  // rehydrate
  archiveManager.rehydrate();
}
