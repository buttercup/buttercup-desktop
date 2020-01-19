import ms from 'ms';
import { lockArchive } from '../../shared/actions/archives';
import { getAllArchives } from '../../shared/selectors';

const __cache = {
  timer: null
};

export const setupArchiveActions = store => ({
  lockAllArchives() {
    const archives = getAllArchives(store.getState());
    if (archives) {
      archives.forEach(
        ({ id, status }) =>
          status === 'unlocked' ? store.dispatch(lockArchive(id)) : ''
      );
    }
  },
  lockArchiveTimer() {
    if (__cache.timer) {
      clearTimeout(__cache.timer);
    }
    const state = store.getState();

    const {
      autolockSeconds,
      lockArchiveOnFocusout,
      isButtercupFocused
    } = state.settings;

    if (
      (autolockSeconds === '0' &&
        (lockArchiveOnFocusout && !isButtercupFocused)) ||
      (autolockSeconds !== '0' &&
        ((lockArchiveOnFocusout && !isButtercupFocused) ||
          !lockArchiveOnFocusout))
    ) {
      __cache.timer = setTimeout(() => {
        this.lockAllArchives();
      }, ms(autolockSeconds + 's'));
    }
  }
});
