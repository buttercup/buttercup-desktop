import test from 'ava';
import path from 'path';
import pify from 'pify';
import fsLib from 'fs';
import rimrafCb from 'rimraf';
import tmpLib from 'tmp';
import IconFileStorage from '../../../../../src/main/lib/icon/IconFileStorage';

const fs = pify(fsLib);
const tmp = pify(tmpLib);
const rimraf = pify(rimrafCb);

const createTmpDir = async () => tmp.dir({ unsafeCleanup: true });

test('encode and decode icon', async t => {
  // Get the inital binary buffer from a real icon
  const buffer = await fs.readFile(path.join(__dirname, 'buttercup.ico'));
  const dir = await createTmpDir();
  const storage = new IconFileStorage(dir);
  storage.encodeIconForStorage = data => data;

  const encoded = await storage.encodeIconForStorage(buffer);
  const decoded = await storage.decodeIconFromStorage(encoded);

  t.is(decoded, buffer);
});

test('store, retrieve and delete icon', async t => {
  const dir = await createTmpDir();
  const storagePath = path.join(dir, 'icons');
  const storage = new IconFileStorage(storagePath);
  storage.encodeIconForStorage = data => data;

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

  // Delete the dir
  await rimraf(storagePath);

  // Should create it automatically (and be writable)
  await storage.storeIcon('https://google.com', '(fake)');

  // We check that the dir exists and it's writable
  const filePath = path.join(storagePath, 'baz');
  await fs.writeFile(filePath, 'I am file content');

  // Read the file, ensure it's written
  t.is(await fs.readFile(filePath, 'utf8'), 'I am file content');

  // Delete the dir again
  await rimraf(storagePath);
});
