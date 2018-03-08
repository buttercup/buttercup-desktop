import fsLib from 'fs';
import mkdirpLib from 'mkdirp';
import pify from 'pify';
import path from 'path';
import { StorageInterface } from '@buttercup/iconographer';
import { md5 } from '../../utils/hash';

const fs = pify(fsLib);
const mkdirp = pify(mkdirpLib);
const isNotFoundError = err => err.code === 'ENOENT';

function retryWithDirCreation(dirPath, func) {
  return func().catch(async err => {
    if (isNotFoundError(err)) {
      await mkdirp(dirPath);
      return func();
    }
    throw err;
  });
}

export default class IconFileStorage extends StorageInterface {
  constructor(path) {
    super();
    this.path = path;
  }

  _buildKeyPath(iconKey) {
    const fileName = `${md5(iconKey)}.dat`;
    return path.join(this.path, fileName);
  }

  encodeIconForStorage(iconData) {
    const reader = new window.FileReader();
    reader.readAsDataURL(new Blob([iconData]));
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  /**
   * Delete an icon in storage
   * @param {String} iconKey The icon key
   * @returns {Promise} A promise that resolves once deletion has completed
   */
  deleteIcon(iconKey) {
    return fs.unlink(this._buildKeyPath(iconKey));
  }

  /**
   * Retrieve the raw data for an icon
   * @param {String} iconKey The icon key
   * @returns {Promise.<*>} A promise that resolves with raw icon data
  */
  async retrieveIcon(iconKey) {
    try {
      return await fs.readFile(this._buildKeyPath(iconKey));
    } catch (err) {
      if (isNotFoundError(err)) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Store encoded icon data
   * @param {String} iconKey The icon key
   * @param {*} iconData The encoded icon data
   * @returns {Promise} A promise that resolves once storage has been completed
   */
  storeIcon(iconKey, iconData) {
    const path = this._buildKeyPath(iconKey);
    return retryWithDirCreation(this.path, () => fs.writeFile(path, iconData));
  }
}
