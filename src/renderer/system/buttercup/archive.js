import { Workspace, Archive, createCredentials } from 'buttercup-web';
import { IpcDatasource } from './ipc-datasource';

let __currentWorkspace = null;

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

export async function loadWorkspace(filename, password, isNew) {
  const passwordCredentials = createCredentials.fromPassword(password);
  const datasource = IpcDatasource.fromObject({
    type: 'ipc',
    path: filename
  });

  if (isNew) {
    await createDefaults(datasource, passwordCredentials);
  }

  const workspace = await createWorkspace(datasource, passwordCredentials);
  __currentWorkspace = {
    instance: workspace,
    filename
  };

  return {
    id: getArchive().getID(),
    path: filename
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
