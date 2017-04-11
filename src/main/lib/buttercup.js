import { importFromKDBX } from 'buttercup-importer';

export function importKeepass(filename, password) {
  return importFromKDBX(filename, password)
    .then(archive => archive.getHistory());
}
