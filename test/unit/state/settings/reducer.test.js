import test from 'ava';
import { settings } from '../../../../src/shared/reducers/settings';

import {
  COLUMN_SIZE_SET,
  SETTING_SET
} from '../../../../src/shared/actions/types';
import {
  setSetting,
  setColumnSize
} from '../../../../src/shared/actions/settings';

test.afterEach(t => {});

const initialState = {
  columnSizes: {
    tree: 230,
    entries: 230
  },
  isButtercupFocused: true,
  condencedSidebar: true,
  menubarAutoHide: false,
  archivesLoading: false,
  isTrayIconEnabled: true,
  secondsUntilClearClipboard: '15',
  autolockSeconds: '0',
  lockArchiveOnFocusout: false,
  lockArchiveOnMinimize: false,
  referenceFontSize: '1',
  isBrowserAccessEnabled: false,
  isAutoloadingIconsDisabled: false,
  locale: '',
  globalShortcuts: {
    'preferences.minimize-and-maximize': 'CommandOrControl+Shift+X',
    'app-menu.app.preferences': 'CmdOrCtrl+,',
    'app-menu.archive.new': 'CmdOrCtrl+Shift+N',
    'app-menu.archive.open': 'CmdOrCtrl+O',
    'app-menu.archive.connect-cloud-sources': 'CmdOrCtrl+Shift+C',
    'entry.add-entry': 'CmdOrCtrl+N',
    'group.new-group': 'CmdOrCtrl+G',
    'app-menu.archive.search': 'CmdOrCtrl+F',
    'app-menu.view.condensed-sidebar': 'CmdOrCtrl+Shift+B'
  }
};

test('should return initial settings', t => {
  t.deepEqual(settings(undefined, {}), {
    ...initialState
  });
});

test('should handle SETTING_SET', t => {
  const payload = {
    key: 'testValue',
    value: 'tested'
  };

  t.deepEqual(
    settings(undefined, {
      type: SETTING_SET,
      payload
    }),
    {
      ...initialState,
      testValue: 'tested'
    }
  );
});

test('should handle setSetting()', t => {
  t.deepEqual(settings(undefined, setSetting('testNumber', 123)), {
    ...initialState,
    testNumber: 123
  });
});

test('should handle COLUMN_SIZE_SET', t => {
  const payload = {
    name: 'tree',
    size: 456
  };

  t.deepEqual(
    settings(undefined, {
      type: COLUMN_SIZE_SET,
      payload
    }),
    {
      ...initialState,
      columnSizes: {
        ...initialState.columnSizes,
        tree: 456
      }
    }
  );
});

test('should handle setColumnSize()', t => {
  t.deepEqual(
    settings(
      undefined,
      setColumnSize({
        name: 'tree',
        size: 456
      })
    ),
    {
      ...initialState,
      columnSizes: {
        ...initialState.columnSizes,
        tree: 456
      }
    }
  );
  t.deepEqual(
    settings(
      undefined,
      setColumnSize({
        name: 'entries',
        size: 789
      })
    ),
    {
      ...initialState,
      columnSizes: {
        ...initialState.columnSizes,
        entries: 789
      }
    }
  );
});
