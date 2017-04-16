import { ipcRenderer as ipc } from 'electron';
import { TextDatasource, DatasourceAdapter } from 'buttercup-web';

const registerDatasource = DatasourceAdapter.registerDatasource;

/**
 * Datasource for Ipc archives
 * @augments TextDatasource
 */
export class IpcDatasource extends TextDatasource {
  constructor(filePath) {
    super('');
    this.path = filePath;
  }

  load(password) {
    return Promise
      .resolve(ipc.sendSync('read-archive', this.path))
      .then(content => {
        this.setContent(content);
        return super.load(password);
      });
  }

  save(archive, password) {
    return super
      .save(archive, password)
      .then(encryptedContent => {
        ipc.sendSync('write-archive', {
          filename: this.path,
          content: encryptedContent
        });
      });
  }

  /**
   * Output the datasource as an object
   * @returns {Object} An object describing the datasource
   */
  toObject() {
    return {
      type: 'ipc',
      path: this.path
    };
  }
}

IpcDatasource.fromObject = obj => {
  if (obj.type === 'ipc') {
    return new IpcDatasource(obj.path);
  }
  throw new Error(`Unknown or invalid type: ${obj.type}`);
};

IpcDatasource.fromString = (str, hostCredentials) => {
  return IpcDatasource.fromObject(JSON.parse(str), hostCredentials);
};

registerDatasource('ipc', IpcDatasource);
