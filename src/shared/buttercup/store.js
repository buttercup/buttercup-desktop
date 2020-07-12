import { getSharedVaultManager, setSharedSearch } from './archive';
import { Search } from './buttercup';
import { resetArchivesInStore } from '../actions/archives.js';
import { setSetting } from '../actions/settings';

export function linkVaultManagerToStore(store) {
  const manager = getSharedVaultManager();

  manager.on('sourcesUpdated', async function __handleUpdatedSources() {
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

    const searchInstance = new Search(
      manager.unlockedSources.map(source => source.vault)
    );
    setSharedSearch(searchInstance);
    searchInstance.prepare();
  });

  // rehydrate
  manager.rehydrate();
}
