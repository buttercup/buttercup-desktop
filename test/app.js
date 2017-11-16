import path from 'path';
import test from 'ava';
import { ArchiveTypes } from '../src/shared/buttercup/types';
import { loadFile } from '../src/main/lib/files';
import { Application } from 'spectron';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let app;
let buttons;
let inputs;
test.before(async t => {
  app = new Application({
    path: require('electron'),
    args: [path.join(__dirname, '../app')]
  });

  await app.start();
  await app.client.waitUntilWindowLoaded();
});

test.after(async t => {
  await app.stop();
});

const payload = {
  type: ArchiveTypes.FILE,
  path: path.resolve(__dirname, './test.bcup'),
  isNew: true
};

test(async t => {
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

test('test input focus', async t => {
  // create temp archive
  await app.webContents.send('load-archive', payload);

  await sleep(500);
  await app.client.setValue('input[type="password"]', '1');
  await app.client.keys('Enter');

  await app.client.setValue('input[type="password"]', '1');
  await app.client.keys('Enter');

  await sleep(2000);

  // click add entry
  buttons = await app.client.elements('button');
  await app.client.elementIdClick(buttons.value[3].ELEMENT);

  await sleep(1000);

  // entry is open
  buttons = await app.client.elements('button');
  inputs = await app.client.elements('input');
  await app.client.elementIdClick(buttons.value[4].ELEMENT);

  // set title
  await app.client.setValue('input[name="properties.title"]', 'title');

  // get title
  const titleInput = await app.client.getValue(
    'input[name="properties.title"]'
  );
  console.log('inputs', titleInput);

  // test title
  t.true(titleInput === 'title');
});
