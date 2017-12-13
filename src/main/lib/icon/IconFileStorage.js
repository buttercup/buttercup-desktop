import fsLib from 'fs';
import mkdirpLib from 'mkdirp';
import pify from 'pify';
import path from 'path';
import sanitize from 'sanitize-filename';
import { StorageInterface } from '@buttercup/iconographer';

const fs = pify(fsLib);
const mkdirp = pify(mkdirpLib);

export default class IconFileStorage extends StorageInterface {
  constructor(path) {
    super();
    this.path = path;
  }

  _buildKeyPath(iconKey) {
    // TODO No extension?
    return path.join(this.path, sanitize(iconKey)) + '.icon.dat';
  }

  /**
     * Decode icon data that was pulled from storage
     * @param {*} data The encoded data as it was stored
     * @returns {Promise.<Buffer>} A promise that resolves with a buffer
     */
  decodeIconFromStorage(data) {
    return Promise.resolve(data);
  }

  /**
     * Delete an icon in storage
     * @param {String} iconKey The icon key
     * @returns {Promise} A promise that resolves once deletion has completed
     */
  async deleteIcon(iconKey) {
    return fs.unlink(this._buildKeyPath(iconKey));
  }

  /**
     * Encode icon data for storage
     * @param {Buffer} data The data buffer for encoding
     * @returns {Promise.<*>} A promise that resolves with the encoded data ready
     *  for storage
     */
  encodeIconForStorage(data) {
    return Promise.resolve(data);
  }

  /**
     * Fetch all icon keys
     * @returns {Promise.<Array.<String>>} A promise that resolves with an array of icon keys
     */
  async getIconKeys() {
    const path = this.path;
    return this._retryWithDirCreation(() => fs.readdir(path));
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
  async storeIcon(iconKey, iconData) {
    const path = this._buildKeyPath(iconKey);
    return this._retryWithDirCreation(() => fs.writeFile(path, iconData));
  }

  /**
   * Wrap a function in a retry, creating the storage dir before retrying
   * @param {Function} func 
   */
  async _retryWithDirCreation(func) {
    try {
      return await func();
    } catch (err) {
      if (isNotFoundError(err)) {
        await mkdirp(this.path);
        return func();
      }
      throw err;
    }
  }
}

const isNotFoundError = err => err.code === 'ENOENT';
