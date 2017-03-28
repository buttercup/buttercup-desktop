import { Workspace, Archive, createCredentials } from 'buttercup-web';
import { IpcDatasource } from './ipc-datasource';

let __currentWorkspace = null;
export const archiveTypes = {
  FILE: 'ipc',
  DROPBOX: 'dropbox',
  OWNCLOUD: 'owncloud',
  WEBDAV: 'webdav'
};

function createWorkspace(datasource, passwordCredentials) {
  const workspace = new Workspace();

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

function createDefaults(datasource, passwordCredentials) {
  const archive = Archive.createWithDefaults();
  return datasource.save(archive, passwordCredentials);
}

function createDatasourceFromConfig(config) {
  switch (config.type) {
    case archiveTypes.FILE:
      return IpcDatasource.fromObject({
        type: config.type,
        path: config.path
      });
    default:
      throw new Error('Datasource type has not been recognized.');
  }
}

export async function loadWorkspace(config, masterPassword, isNew) {
  const passwordCredentials = createCredentials.fromPassword(masterPassword);
  const datasource = createDatasourceFromConfig(config);

  if (isNew === true) {
    await createDefaults(datasource, passwordCredentials);
  }

  const workspace = await createWorkspace(datasource, passwordCredentials);
  __currentWorkspace = {
    instance: workspace,
    config
  };

  return {
    id: getArchive().getID(),
    ...config
  };
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
  return getWorkspace().instance.save();
}
