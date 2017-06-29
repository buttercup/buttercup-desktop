import { Workspace, Archive, createCredentials, DatasourceAdapter } from 'buttercup-web';
// import './ipc-datasource';

let __currentWorkspace = null;

function createWorkspace(datasource, passwordCredentials) {
  const workspace = new Workspace();

  return datasource
    .load(passwordCredentials)
    .then(archive => {
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

async function parseConfig(config, passwordCredentials) {
  let { credentials, datasource, encryptedCredentials, isNew, ...rest } = config;

  if (typeof encryptedCredentials === 'string') {
    credentials = await createCredentials.fromSecureString(encryptedCredentials, passwordCredentials);
    datasource = credentials.getValueOrFail('datasource');
  } else {
    datasource = {
      type: config.type,
      ...datasource
    };
    encryptedCredentials = createCredentials(rest.type, credentials);
    encryptedCredentials.setValue('datasource', datasource);
    encryptedCredentials = await encryptedCredentials.toSecureString(passwordCredentials);
  }

  return {
    isNew,
    credentials,
    datasource,
    config: {
      ...rest,
      encryptedCredentials
    }
  };
}

export async function loadWorkspace(masterConfig, masterPassword) {
  // const { isNew, credentials, datasource, config } = await parseConfig(masterConfig, masterPassword);
  // const dsInstance = DatasourceAdapter.objectToDatasource(datasource, credentials);

  const passwordCredentials = createCredentials.fromPassword(masterPassword);
  const { credentials, datasource, type, path } = masterConfig;
  const encryptedCredentials = createCredentials(type, credentials);
  encryptedCredentials.setValue('datasource', {
    type,
    ...datasource
  });

  console.log(passwordCredentials, encryptedCredentials);



  // if (isNew === true) {
  //   await createDefaults(dsInstance, passwordCredentials);
  // }

  // const workspace = await createWorkspace(dsInstance, passwordCredentials);
  // __currentWorkspace = {
  //   instance: workspace,
  //   ...config
  // };

  // return {
  //   id: getArchive().getID(),
  //   ...config
  // };
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
  const workspace = getWorkspace().instance;
  return workspace
    .localDiffersFromRemote()
    .then(differs => differs
      ? workspace.mergeSaveablesFromRemote().then(() => true)
      : false
    )
    .then(shouldSave => shouldSave
      ? workspace.save()
      : null
    );
}
