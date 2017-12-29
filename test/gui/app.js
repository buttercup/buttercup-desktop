import path from 'path';
import test from 'ava';
import { ArchiveTypes } from '../../src/shared/buttercup/types';
import { Application } from 'spectron';

// method to wait n ms
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// global vars
let app;
let buttons;
let inputs;

test.before(async t => {
  app = new Application({
    path: require('electron'),
    args: [path.join(__dirname, '../../app')]
  });

  await app.start();
  await app.client.waitUntilWindowLoaded();
});

test.after(async t => {
  if (app && app.isRunning()) {
    await app.stop();
  }
});

const payload = {
  type: ArchiveTypes.FILE,
  path: path.resolve(__dirname, './test.bcup'),
  isNew: true
};

test('check if window is loaded and visible', async t => {
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

// input test
test('test input focus', async t => {
  // create temp archive
  await app.webContents.send('load-archive', payload);

  // wait for popup
  await sleep(2000);

  await app.client.setValue('input[type="password"]', '1');
  await app.client.keys('Enter');

  // wait for field change
  await sleep(2000);

  await app.client.setValue('input[type="password"]', '1');
  await app.client.keys('Enter');

  // wait for login
  await sleep(5000);

  // click add entry
  buttons = await app.client.elements('button');
  await app.client.elementIdClick(buttons.value[3].ELEMENT);

  // wait for entry form
  await sleep(2000);

  // entry form is open
  buttons = await app.client.elements('button');
  inputs = await app.client.elements('input');
  await app.client.elementIdClick(buttons.value[4].ELEMENT);

  // save
  await sleep(1500);

  // set title
  await app.client.setValue('input[name="properties.title"]', 'title');

  // get title
  const titleInput = await app.client.getValue(
    'input[name="properties.title"]'
  );

  // test title
  t.true(titleInput === 'title');
});
