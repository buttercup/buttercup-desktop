import { ipcRenderer as ipc } from 'electron';
import {
  Workspace,
  createCredentials,
  TextDatasource,
  Archive
} from 'buttercup-web';

let __curentWorkspace = null;

/**
 * Read text file from disk
 * 
 * @param {string} filename
 * @returns {string} File content
 */
function readTextFile(filename) {
  return ipc.sendSync('read-archive', filename);
}

/**
 * Write a text file to disk
 * 
 * @param {string} filename
 * @param {string} content
 * @returns {void}
 */
function writeTextFile(filename, content) {
  ipc.sendSync('write-archive', { filename, content });
}

/**
 * Return a Buttercup workspace
 * using content and password
 * 
 * @param {string} content
 * @param {string} password
 * @returns {Promise.<Buttercup.Workspace>}
 */
function createWorkspace(content, password) {
  const workspace = new Workspace();
  const datasource = new TextDatasource(content);
  const passwordCredentials = createCredentials.fromPassword(password);

  // Load the datasource
  return datasource
    .load(passwordCredentials)
    .then(archive => {
      // Fill up the datasource
      workspace.setPrimaryArchive(
        archive,
        datasource,
        passwordCredentials
      );
      return workspace;
    });
}

/**
 * Load a workspace from existing file
 * 
 * @param {string} filename
 * @param {string} password
 * @returns {Promise.<Buttercup.Workspace>}
 */
export function loadWorkspace(filename, password) {
  const content = readTextFile(filename);
  return createWorkspace(content, password).then(workspace => {
    __curentWorkspace = {
      instance: workspace,
      filename
    };
    return {
      path: filename
    };
  });
}

/**
 * Create a new workspace and write to disk 
 * 
 * @param {string} filename
 * @param {string} password
 * @returns {Promise.<Buttercup.Workspace>}
 */
export function newWorkspace(filename, password) {
  const archive = Archive.createWithDefaults();
  const dataSource = new TextDatasource('');
  const passwordCredentials = createCredentials.fromPassword(password);

  // Save the datasource and load it up.
  return dataSource
    .save(archive, passwordCredentials)
    .then(content => {
      writeTextFile(filename, content);
      return createWorkspace(content, password).then(workspace => {
        __curentWorkspace = {
          instance: workspace,
          filename
        };
        return {
          path: filename
        };
      });
    });
}

export function getWorkspace() {
  if (__curentWorkspace === null) {
    return null;
  }
  return __curentWorkspace;
}

export function getArchive() {
  return getWorkspace().instance.primary.archive;
}

export function saveWorkspace() {
  const workspace = getWorkspace();
  return workspace.instance.save().then(contents => {
    // workspace saves an array of archives, but we only want the first (only) one
    const content = contents[0];
    ipc.send('write-archive', { filename: workspace.filename, content });
  });
}
