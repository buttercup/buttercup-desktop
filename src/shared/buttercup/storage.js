import Buttercup from 'buttercup/dist/buttercup-web.min';
import Store from 'electron-store';

const { StorageInterface } = Buttercup.storage;
const storage = new Store({
  name: 'archives'
});

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
      const values = [...storage];
      resolve(values.map(val => val[0]));
    });
  }

  /**
   * Get the value of a key
   * @param {String} name The key name
   * @returns {Promise.<String>} A promise that resolves with the value
   */
  getValue(name) {
    return new Promise((resolve, reject) => {
      resolve(storage.get(name));
    });
  }

  /**
   * Remove a key from the storage
   * @param {String} key The key to remove
   * @returns {Promise} A promise that resolves once the item has been removed
   */
  removeKey(key) {
    return new Promise((resolve, reject) => {
      resolve(storage.delete(key));
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
      resolve(storage.set(name, value));
    });
  }
}
