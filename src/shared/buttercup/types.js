export const ArchiveTypes = {
  FILE: 'ipc',
  DROPBOX: 'dropbox',
  OWNCLOUD: 'owncloud',
  NEXTCLOUD: 'nextcloud',
  WEBDAV: 'webdav'
};

export const ImportTypes = {
  ONE_PASSWORD: '1password',
  KEEPASS: 'keepass',
  LASTPASS: 'lastpass'
};

export const ImportTypeInfo = {
  [ImportTypes.ONE_PASSWORD]: {
    password: false,
    name: '1Password',
    extension: '1pif'
  },
  [ImportTypes.KEEPASS]: {
    password: true,
    name: 'KeePass',
    extension: 'kdbx'
  },
  [ImportTypes.LASTPASS]: {
    password: false,
    name: 'LastPass',
    extension: 'csv'
  }
};
