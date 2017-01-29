import path from 'path';
import test from 'ava';
import { Application } from 'spectron';

test.beforeEach(async t => {
  t.context.app = new Application({
    path: path.join(__dirname, '../release/mac/Buttercup.app/Contents/MacOS/Buttercup')
  });

  await t.context.app.start();
});

test.afterEach.always(async t => {
  await t.context.app.stop();
});

test(async t => {
  const app = t.context.app;
  await app.client.waitUntilWindowLoaded();

  const win = app.browserWindow;
  t.is(await app.client.getWindowCount(), 1);
  t.false(await win.isMinimized());
  t.false(await win.isDevToolsOpened());
  t.true(await win.isVisible());
  t.true(await win.isFocused());

  const { width, height } = await win.getBounds();
  t.true(width > 0);
  t.true(height > 0);
});
