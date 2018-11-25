import { lockArchive } from '../../shared/actions/archives';
import { getAllArchives } from '../../shared/selectors';

export const setupArchiveActions = store => ({
  lockAllArchives() {
    const archives = getAllArchives(store.getState());
    if (archives) {
      archives.forEach(
        ({ id, status }) =>
          status !== 'locked' ? store.dispatch(lockArchive(id)) : ''
      );
    }
  }
});
