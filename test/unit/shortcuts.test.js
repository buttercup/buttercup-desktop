import test from 'ava';
import {
  createShortcutObjectFromString,
  createShortcutStringFromObject
} from '../../src/renderer/components/preferences/elements/shortcut-input';
import { isOSX } from '../../src/shared/utils/platform';

test('createShortcutObjectFromString', async t => {
  t.deepEqual(createShortcutObjectFromString('CommandOrControl+Shift+X'), {
    altKey: false,
    character: 'x',
    ctrlKey: !isOSX(),
    metaKey: isOSX(),
    shiftKey: true
  });

  t.deepEqual(createShortcutObjectFromString('CmdOrCtrl+N'), {
    altKey: false,
    character: 'n',
    ctrlKey: !isOSX(),
    metaKey: isOSX(),
    shiftKey: false
  });

  t.deepEqual(createShortcutObjectFromString(), {
    altKey: false,
    character: '',
    ctrlKey: false,
    metaKey: false,
    shiftKey: false
  });
});

test('createShortcutStringFromObject', async t => {
  t.is(
    createShortcutStringFromObject({
      altKey: false,
      character: 'x',
      ctrlKey: false,
      metaKey: true,
      shiftKey: true
    }),
    'Cmd+Shift+x'
  );

  t.is(
    createShortcutStringFromObject({
      altKey: false,
      character: 'n',
      ctrlKey: false,
      metaKey: true,
      shiftKey: false
    }),
    'Cmd+n'
  );

  t.is(createShortcutStringFromObject(), '');
});
