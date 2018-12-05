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

    if (
      state.settings.autolockSeconds === '0' &&
      (state.settings.lockArchiveOnFocusout &&
        !state.settings.isButtercupFocused)
    ) {
      this.lockAllArchives();
    } else {
      if (
        state.settings.autolockSeconds !== '0' &&
        ((state.settings.lockArchiveOnFocusout &&
          !state.settings.isButtercupFocused) ||
          !state.settings.lockArchiveOnFocusout)
      ) {
        __cache.timer = setTimeout(() => {
          this.lockAllArchives();
        }, ms(state.settings.autolockSeconds + 's'));
      }
    }
  }
});
