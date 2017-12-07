import fsLib from 'fs';
import pify from 'pify';
import path from 'path';
import { StorageInterface } from '@buttercup/iconographer';

const fs = pify(fsLib);

export default class IconFileStorage extends StorageInterface {
  constructor(path) {
    super();
    this.path = path;
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
  deleteIcon(iconKey) {
    fs.unlink(this._buildPath(iconKey));
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
  getIconKeys() {
    return fs.readdir(this.path);
  }

  /**
     * Retrieve the raw data for an icon
     * @param {String} iconKey The icon key
     * @returns {Promise.<*>} A promise that resolves with raw icon data
     */
  retrieveIcon(iconKey) {
    return fs.readFile(this._buildPath(iconKey));
  }

  /**
     * Store encoded icon data
     * @param {String} iconKey The icon key
     * @param {*} iconData The encoded icon data
     * @returns {Promise} A promise that resolves once storage has been completed
     */
  storeIcon(iconKey, iconData) {
    return fs.writeFile(this._buildPath(iconKey), iconData);
  }

  _buildPath(iconKey) {
    return path.join(this.path, iconKey);
  }
}
