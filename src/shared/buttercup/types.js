export const ArchiveTypes = {
  FILE: 'ipc',
  DROPBOX: 'dropbox',
  GOOGLEDRIVE: 'googledrive',
  OWNCLOUD: 'owncloud',
  NEXTCLOUD: 'nextcloud',
  WEBDAV: 'webdav'
};

export const ImportTypes = {
  BUTTERCUP: 'buttercup-csv',
  KEEPASS: 'keepass',
  LASTPASS: 'lastpass',
  ONE_PASSWORD: '1password',
  CSV_GENERIC: 'csv_generic',
  BITWARDEN: 'bitwarden'
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
  },
  [ImportTypes.BITWARDEN]: {
    password: false,
    name: 'Bitwarden (JSON)',
    extension: 'json'
  },
  [ImportTypes.BUTTERCUP]: {
    password: false,
    name: 'Buttercup (CSV)',
    extension: 'csv'
  },
  [ImportTypes.CSV_GENERIC]: {
    password: false,
    name: 'Generic (CSV)',
    extension: 'csv',
    hidden: true
  }
};

export const PasswordDialogRequestTypes = {
  UNLOCK: 'unlock',
  PASSWORD_CHANGE: 'change',
  NEW_VAULT: 'new',
  IMPORT: 'import'
};
