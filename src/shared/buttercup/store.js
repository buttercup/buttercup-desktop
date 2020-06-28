import { getSharedVaultManager } from './archive';
import { resetArchivesInStore } from '../actions/archives.js';
import { setSetting } from '../actions/settings';

export function linkVaultManagerToStore(store) {
  const manager = getSharedVaultManager();

  manager.on('sourcesUpdated', function __handleUpdatedSources() {
    store.dispatch(setSetting('archivesLoading', false));
    store.dispatch(
      resetArchivesInStore(
        manager.sources.map(source => ({
          name: source.name,
          id: source.id,
          type: source.type,
          status: source.status,
          colour: source.colour,
          order: source.order
        }))
      )
    );
  });

  // rehydrate
  manager.rehydrate();
}
