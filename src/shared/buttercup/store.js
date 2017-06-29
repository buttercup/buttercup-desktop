import { getSharedArchiveManager } from './archive';
import {
  addArchive,
  removeArchive,
  unlockArchive,
} from '../actions/archives.js';

export function linkArchiveManagerToStore(store) {
  const archiveManager = getSharedArchiveManager();

  // attach listeners
  archiveManager.on('sourceAdded', function __handleNewSource(sourceInfo) {
    console.log('Source added', sourceInfo);
    store.dispatch(addArchive(sourceInfo));
  });
  archiveManager.on('sourceRehydrated', function __handleRehydratedSource(sourceInfo) {
    console.log('Source rehydrated', sourceInfo);
    store.dispatch(addArchive(sourceInfo));
  });
  archiveManager.on('sourceUnlocked', function __handleUnlockedSource(sourceInfo) {
    console.log('Source unlocked', sourceInfo);
    store.dispatch(unlockArchive(sourceInfo.id));
  });
  archiveManager.on('sourceRemoved', function __handleRemovedSource(sourceInfo) {
    console.log('Source removed', sourceInfo);
    store.dispatch(removeArchive(sourceInfo.id));
  });

  // rehydrate
  archiveManager.rehydrate();
}
