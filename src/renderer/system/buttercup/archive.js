import { ipcRenderer as ipc } from 'electron';

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
  const workspace = new Buttercup.Workspace();
  const datasource = new Buttercup.TextDatasource(content);

  // Load the datasource
  return datasource.load(password).then(archive => {
    // Fill up the datasource
    workspace
      .setArchive(archive)
      .setDatasource(datasource)
      .setPassword(password);
    
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
  const archive = Buttercup.Archive.createWithDefaults();
  const dataSource = new Buttercup.TextDatasource('');

  // Save the datasource and load it up.
  return dataSource.save(archive, password).then(content => {
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
  return getWorkspace().instance.getArchive(); 
}

export function saveWorkspace() {
  const workspace = getWorkspace();
  return workspace.instance.save().then(content => {
    ipc.send('write-archive', { filename: workspace.filename, content });
  });
}
