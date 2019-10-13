import Mousetrap from 'mousetrap';
import { lockArchive } from '../../shared/actions/archives';

import {
  getCurrentArchiveId,
  getCurrentEntry,
  getSetting
} from '../../shared/selectors';
import { copyToClipboard, readClipboard } from './utils';
import { getFacadeFieldValue } from '../../shared/buttercup/entries';

import { getShortcutByKey } from '../../shared/utils/global-shortcuts';

const __cache = {
  timer: null,
  shortcuts: []
};

/**
 * Transform shortcuts to valid mousetrap shortcuts
 * @param {string} shortcut
 */
const transformToMousetrapShortcut = shortcut => {
  const replacements = [
    {
      search: 'CmdOrCtrl',
      replaceWith: 'mod'
    }
  ];

  let replacedShortcut = shortcut;

  replacements.forEach(({ search, replaceWith }) => {
    replacedShortcut = replacedShortcut.replace(search, replaceWith);
  });

  return replacedShortcut.toLowerCase();
};

export const setupShortcuts = store => {
  const state = store.getState();
  const globalShortcuts = getSetting(state, 'globalShortcuts');

  if (__cache.shortcuts) {
    Mousetrap.unbind(
      Object.keys(__cache.shortcuts).map(key => __cache.shortcuts[key])
    );
  }

  __cache.shortcuts = {
    password: transformToMousetrapShortcut(
      getShortcutByKey('entry-menu.password', globalShortcuts)
    ),
    username: transformToMousetrapShortcut(
      getShortcutByKey('entry-menu.username', globalShortcuts)
    ),
    lock: transformToMousetrapShortcut(
      getShortcutByKey('archive-menu.lock', globalShortcuts)
    )
  };

  /**
   * Copy password to clipboard
   */
  Mousetrap.bind(__cache.shortcuts.password, () => {
    if (__cache.timer) {
      clearTimeout(__cache.timer);
    }

    const state = store.getState();
    const selection = window.getSelection().toString();
    const currentEntry = getCurrentEntry(state);

    if (!selection && currentEntry) {
      const password = getFacadeFieldValue(currentEntry, 'password');

      if (!password) {
        return;
      }

      copyToClipboard(
        password,
        true,
        state.settings.secondsUntilClearClipboard
      );
    }
  });

  /**
   * Copy username to clipboard
   */
  Mousetrap.bind(__cache.shortcuts.username, () => {
    const currentEntry = getCurrentEntry(store.getState());

    if (currentEntry) {
      const username = getFacadeFieldValue(currentEntry, 'username');

      if (username) {
        copyToClipboard(username);
      }
    }
  });

  /**
   * Lock Current Archive
   */
  Mousetrap.bind(__cache.shortcuts.lock, () => {
    const currentArchiveId = getCurrentArchiveId(store.getState());
    if (currentArchiveId) {
      store.dispatch(lockArchive(currentArchiveId));
    }
  });
};
