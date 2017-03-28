import { ipcRenderer as ipc } from 'electron';
import {
  Workspace,
  createCredentials,
  TextDatasource,
  Archive
} from 'buttercup-web';

let __currentWorkspace = null;

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

function createDefaults(filename, password) {
  const archive = Archive.createWithDefaults();
  const passwordCredentials = createCredentials.fromPassword(password);
  const dataSource = new TextDatasource('');
  
  return dataSource
    .save(archive, passwordCredentials)
    .then(content => {
      writeTextFile(filename, content);
      return content;
    });
}

export async function loadWorkspace(filename, password, isNew) {
  let content;

  if (isNew) {
    content = await createDefaults(filename, password);
  } else {
    content = readTextFile(filename);
  }

  return createWorkspace(content, password).then(workspace => {
    __currentWorkspace = {
      instance: workspace,
      filename
    };
    return {
      id: getArchive().getID(),
      path: filename
    };
  });
}

export function getWorkspace() {
  if (__currentWorkspace === null) {
    return null;
  }
  return __currentWorkspace;
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
