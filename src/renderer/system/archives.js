import ms from 'ms';
import { lockArchive } from '../../shared/actions/archives';
import { getAllArchives } from '../../shared/selectors';

const __cache = {
  timer: null,
  locking: false
};

export const setupArchiveActions = store => ({
  lockAllArchives() {
    if (!__cache.locking) {
      const archives = getAllArchives(store.getState());
      if (archives) {
        console.log(archives);
        archives.forEach(
          ({ id, status }) =>
            status === 'unlocked' ? store.dispatch(lockArchive(id)) : ''
        );
      }
    }

    __cache.locking = true;
    setTimeout(() => (__cache.locking = false), 300);
  },
  lockArchiveTimer() {
    if (!__cache.locking) {
      if (__cache.timer) {
        clearTimeout(__cache.timer);
      }
      const state = store.getState();

      if (
        state.settings &&
        state.settings.secondsUntilArchiveShouldClose === '0' &&
        (state.settings.lockArchiveOnFocusout &&
          !state.settings.buttercupIsFocused)
      ) {
        this.lockAllArchives();
      } else {
        if (
          state.settings &&
          state.settings.secondsUntilArchiveShouldClose !== '0' &&
          ((state.settings.lockArchiveOnFocusout &&
            !state.settings.buttercupIsFocused) ||
            !state.settings.lockArchiveOnFocusout)
        ) {
          __cache.timer = setTimeout(() => {
            this.lockAllArchives();
          }, ms(state.settings.secondsUntilArchiveShouldClose + 's'));
        }
      }
    }
  }
});
