import fs from 'fs';
import { TextDatasource, registerDatasource } from './buttercup';

/**
 * Datasource for Ipc archives
 * @augments TextDatasource
 */
export class IpcDatasource extends TextDatasource {
  constructor(credentials) {
    super(credentials);
    const {
      data: { datasource }
    } = credentials.getData();
    this.path = datasource.path;
    this.type = 'ipc';
  }

  load(credentials) {
    return Promise.resolve(fs.readFileSync(this.path, 'utf8')).then(content => {
      this.setContent(content);
      return super.load(credentials);
    });
  }

  save(history, credentials) {
    return super.save(history, credentials).then(encryptedContent => {
      return fs.writeFileSync(this.path, encryptedContent, 'utf8');
    });
  }
}

registerDatasource('ipc', IpcDatasource, {
  open: true
});
