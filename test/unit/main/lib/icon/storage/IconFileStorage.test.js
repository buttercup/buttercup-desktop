import test from 'ava';
import path from 'path';
import pify from 'pify';
import fsLib from 'fs';
import tmpLib from 'tmp';
import IconFileStorage from '../../../../../../src/main/lib/icon/storage/IconFileStorage';

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

test('get icon keys, empty results', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);

  const keys = await storage.getIconKeys();
  t.deepEqual(keys, []);
});

test('store, retrieve and delete icon', async t => {
  const dir = await createTmpDir();
  const storagePath = path.join(dir, 'icons');
  const storage = new IconFileStorage(storagePath);

  const buffer = await fs.readFile(path.join(__dirname, 'buttercup.ico'));
  const data = await storage.encodeIconForStorage(buffer);

  // Should sanitize key name (any chars causing an invalid path)
  const key = 'http://buttercup.pw';
  await storage.storeIcon(key, data);
  const retrieved = await storage.retrieveIcon(key);

  t.deepEqual(retrieved, data);

  await storage.deleteIcon(key);

  const files = await fs.readdir(storagePath);
  t.deepEqual(files, []);
});

test('retrieve icon, dir does not exist', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(path.join(dir, 'foo'));

  const icon = await storage.retrieveIcon('bar');
  t.is(icon, null);
});

test('retrieve icon, file does not exist', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);

  const icon = await storage.retrieveIcon('bar');
  t.is(icon, null);
});

test('delete icon, dir does not exist', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(path.join(dir, 'foo'));

  try {
    await storage.deleteIcon('bar');
    t.fail('Should throw Error');
  } catch (err) {
    t.is(err.code, 'ENOENT');
  }
});

test('delete icon, file does not exist', async t => {
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);

  try {
    await storage.deleteIcon('bar');
    t.fail('Should throw Error');
  } catch (err) {
    t.is(err.code, 'ENOENT');
  }
});

test('creates dir if does not exist', async t => {
  const dir = await createTmpDir();
  const storagePath = path.join(dir, 'foo', 'bar');
  const storage = new IconFileStorage(storagePath);

  const keys = await storage.getIconKeys();
  t.deepEqual(keys, []);

  // We check that the dir exists and it's writable
  const filePath = path.join(storagePath, 'baz');
  await fs.writeFile(filePath, 'I am file content');

  // Delete the dir
  await fs.unlink(filePath);
  await fs.rmdir(storagePath);

  // Should create it automatically again (and be writable)
  await storage.getIconKeys();
  await fs.writeFile(path.join(storagePath, 'baz'), 'I am file content');
});

const createTmpDir = async () => tmp.dir({ unsafeCleanup: true });
