export const ArchiveTypes = {
  FILE: 'ipc',
  DROPBOX: 'dropbox',
  GOOGLEDRIVE: 'googledrive',
  OWNCLOUD: 'owncloud',
  NEXTCLOUD: 'nextcloud',
  WEBDAV: 'webdav',
  MY_BUTTERCUP: 'mybuttercup'
};

export const ImportTypes = {
  BITWARDEN_JSON: 'bitwarden-json',
  BUTTERCUP: 'buttercup',
  BUTTERCUP_CSV: 'buttercup-csv',
  CSV: 'csv',
  KEEPASS: 'keepass',
  // KEEPASS_XML: 'keepass-xml',
  LASTPASS: 'lastpass',
  ONE_PASSWORD: '1password'
};

export const ImportTypeInfo = {
  [ImportTypes.BITWARDEN_JSON]: {
    password: false,
    name: 'Bitwarden (JSON)',
    extension: 'json'
  },
  [ImportTypes.BUTTERCUP]: {
    password: true,
    name: 'Buttercup (BCUP)',
    extension: 'bcup'
  },
  [ImportTypes.BUTTERCUP_CSV]: {
    password: false,
    name: 'Buttercup (CSV)',
    extension: 'csv'
  },
  [ImportTypes.CSV]: {
    password: false,
    name: 'CSV export',
    extension: 'csv'
  },
  // [ImportTypes.KEEPASS]: {
  //   password: true,
  //   name: 'KeePass',
  //   extension: 'kdbx'
  // },
  [ImportTypes.KEEPASS_XML]: {
    password: false,
    name: 'KeePass (XML)',
    extension: 'xml'
  },
  [ImportTypes.LASTPASS]: {
    password: false,
    name: 'LastPass (CSV)',
    extension: 'csv'
  },
  [ImportTypes.ONE_PASSWORD]: {
    password: false,
    name: '1Password',
    extension: '1pif'
  }
};

export const PasswordDialogRequestTypes = {
  UNLOCK: 'unlock',
  PASSWORD_CHANGE: 'change',
  NEW_VAULT: 'new',
  IMPORT: 'import'
};
