import { importFromKDBX, importFrom1PIF } from 'buttercup-importer';

/**
 * Import archive from file
 *
 * @export
 * @param {string} type
 * @param {string} filename
 * @param {string} password
 */
export function importArchive(type, filename, password) {
  switch (type) {
    case 'kdbx':
      return importFromKDBX(filename, password).then(archive => archive.getHistory());
    case '1pif':
      return importFrom1PIF(filename).then(archive => archive.getHistory());
    default:
      throw new Error('Wrong import type provided');
  }
}
