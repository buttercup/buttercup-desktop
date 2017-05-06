import dropboxLogo from '../../renderer/styles/img/logos/dropbox.svg';
import ownCloud from '../../renderer/styles/img/logos/owncloud.png';
import nextCloud from '../../renderer/styles/img/logos/nextcloud.svg';
import webDAV from '../../renderer/styles/img/logos/webdav.png';
import { ArchiveTypes } from './types';

export const brands = {
  [ArchiveTypes.DROPBOX]: {
    name: 'Dropbox',
    logo: dropboxLogo
  },
  [ArchiveTypes.OWNCLOUD]: {
    name: 'OwnCloud',
    logo: ownCloud
  },
  [ArchiveTypes.NEXTCLOUD]: {
    name: 'Nextcloud',
    logo: nextCloud
  },
  [ArchiveTypes.WEBDAV]: {
    name: 'WebDAV',
    logo: webDAV
  }
};
