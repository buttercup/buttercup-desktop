import Buttercup from 'buttercup-web';
import storage from 'electron-json-storage';

const { StorageInterface } = Buttercup.storage;

/**
 * Interface for localStorage
 * @augments StorageInterface
 */
export default class ElectronStorageInterface extends StorageInterface {
  /**
   * Get all keys from storage
   * @returns {Promise.<Array.<String>>} A promise that resolves with an array of keys
   */
  getAllKeys() {
    return new Promise((resolve, reject) => {
      storage.keys((err, keys) => {
        if (err) {
          return reject(err);
        }
        return resolve(keys.filter(key => key.startsWith('buttercup-')).map(key => key.substr(10)));
      });
    });
  }

  /**
   * Get the value of a key
   * @param {String} name The key name
   * @returns {Promise.<String>} A promise that resolves with the value
   */
  getValue(name) {
    return new Promise((resolve, reject) => {
      storage.get(`buttercup-${name}`, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.value);
      });
    });
  }

  /**
   * Remove a key from the storage
   * @param {String} key The key to remove
   * @returns {Promise} A promise that resolves once the item has been removed
   */
  removeKey(key) {
    return new Promise((resolve, reject) => {
      storage.remove(`buttercup-${key}`, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  /**
   * Set the value for a key
   * @param {String} name The key name
   * @param {String} value The value to set
   * @returns {Promise} A promise that resolves when the value is set
   */
  setValue(name, value) {
    return new Promise((resolve, reject) => {
      storage.set(`buttercup-${name}`, { value }, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}
