import test from 'ava';
import path from 'path';
import pify from 'pify';
import fsLib from 'fs';
import tmpLib from 'tmp';
import IconFileStorage from '../../../../../src/main/lib/icon/storage/IconFileStorage';

const fs = pify(fsLib);
const tmp = pify(tmpLib);

test('encode and decode icon', async t => {
  // Get the inital binary buffer from a real icon
  const buffer = await fs.readFile(path.join(__dirname, 'buttercup.ico'));
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);

  const encoded = await storage.encodeIconForStorage(buffer);
  const decoded = await storage.decodeIconFromStorage(encoded);

  t.is(decoded, buffer);
});

test('get icon keys', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);

  // There shouldn't be any extension so the name is taken as the whole key
  await fs.writeFile(path.join(dir, 'foo.bar'), 'irrelevant');
  await fs.writeFile(path.join(dir, 'bar'), 'irrelevant');
  await fs.writeFile(path.join(dir, 'baz'), 'irrelevant');

  const keys = await storage.getIconKeys();
  keys.sort();
  t.deepEqual(keys, ['bar', 'baz', 'foo.bar']);
});

test('store, retrieve and delete icon', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);

  const buffer = await fs.readFile(path.join(__dirname, 'buttercup.ico'));
  const data = await storage.encodeIconForStorage(buffer);

  const key = 'foo';
  await storage.storeIcon(key, data);
  const retrieved = await storage.retrieveIcon(key);

  t.deepEqual(retrieved, data);

  await storage.deleteIcon(key);

  const files = await fs.readdir(dir);
  t.deepEqual(files, []);
});

const createTmpDir = async () => tmp.dir({ unsafeCleanup: true });
