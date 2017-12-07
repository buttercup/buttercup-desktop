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

  async _getPath() {
    await this._createDirIfNotExists(this.path);
    return this.path;
  }

  async _createDirIfNotExists(path) {
    let stats;
    try {
      stats = await fs.stats(path);
    } catch (err) {}

    if (!stats || !stats.isDirectory()) {
      await mkdirp(path);
    }
  }

  async _buildKeyPath(iconKey) {
    const basePath = await this._getPath();
    return path.join(basePath, sanitize(iconKey)) + '.ico';
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
    const path = await this._buildKeyPath(iconKey);
    return fs.unlink(path);
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
    const path = await this._getPath();
    return fs.readdir(path);
  }

  /**
     * Retrieve the raw data for an icon
     * @param {String} iconKey The icon key
     * @returns {Promise.<*>} A promise that resolves with raw icon data
     */
  async retrieveIcon(iconKey) {
    const path = await this._buildKeyPath(iconKey);
    return fs.readFile(path);
  }

  /**
     * Store encoded icon data
     * @param {String} iconKey The icon key
     * @param {*} iconData The encoded icon data
     * @returns {Promise} A promise that resolves once storage has been completed
     */
  async storeIcon(iconKey, iconData) {
    const path = await this._buildKeyPath(iconKey);
    return fs.writeFile(path, iconData);
  }
}
