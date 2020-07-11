import {
  BitwardenImporter,
  ButtercupCSVImporter,
  ButtercupImporter,
  CSVImporter,
  KDBXImporter,
  KeePass2XMLImporter,
  LastPassImporter,
  OnePasswordImporter
} from '@buttercup/importer';
import { ImportTypes, ImportTypeInfo } from '../../shared/buttercup/types';
import { createVaultFacade } from './buttercupCore';

const IMPORTERS = {
  [ImportTypes.BITWARDEN_JSON]: BitwardenImporter,
  [ImportTypes.BUTTERCUP]: ButtercupImporter,
  [ImportTypes.BUTTERCUP_CSV]: ButtercupCSVImporter,
  [ImportTypes.CSV]: CSVImporter,
  [ImportTypes.KEEPASS]: KDBXImporter,
  [ImportTypes.KEEPASS_XML]: KeePass2XMLImporter,
  [ImportTypes.LASTPASS]: LastPassImporter,
  [ImportTypes.ONE_PASSWORD]: OnePasswordImporter
};

/**
 * Import archive from file
 *
 * @export
 * @param {string} type
 * @param {string} filename
 * @param {string} password
 */
export async function importArchive(type, filename, password) {
  const Importer = IMPORTERS[type];
  const { password: usesPassword } = ImportTypeInfo[type];
  let importer;
  if (usesPassword) {
    importer = await Importer.loadFromFile(filename, password);
  } else {
    importer = await Importer.loadFromFile(filename);
  }
  const vault = await importer.export();
  return createVaultFacade(vault);
}
