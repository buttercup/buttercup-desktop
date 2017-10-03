import dropboxLogo from '../../renderer/styles/img/logos/dropbox.svg';
import ownCloud from '../../renderer/styles/img/logos/owncloud.png';
import ownCloudSquare from '../../renderer/styles/img/logos/owncloud-square.svg';
import nextCloud from '../../renderer/styles/img/logos/nextcloud.svg';
import nextCloudSquare from '../../renderer/styles/img/logos/nextcloud-square.svg';
import webDAV from '../../renderer/styles/img/logos/webdav.png';
import { ArchiveTypes } from './types';

export const brands = {
  [ArchiveTypes.DROPBOX]: {
    remote: true,
    name: 'Dropbox',
    logo: dropboxLogo,
    icon: dropboxLogo
  },
  [ArchiveTypes.OWNCLOUD]: {
    remote: true,
    name: 'OwnCloud',
    logo: ownCloud,
    icon: ownCloudSquare
  },
  [ArchiveTypes.NEXTCLOUD]: {
    remote: true,
    name: 'Nextcloud',
    logo: nextCloud,
    icon: nextCloudSquare
  },
  [ArchiveTypes.WEBDAV]: {
    remote: true,
    name: 'WebDAV',
    logo: webDAV,
    icon: webDAV
  },
  [ArchiveTypes.FILE]: {
    remote: false,
    name: 'File System',
    logo: '',
    icon: ''
  }
};
