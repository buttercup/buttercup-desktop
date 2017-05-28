import dropboxLogo from '../../renderer/styles/img/logos/dropbox.svg';
import dropboxLogoSquare from '../../renderer/styles/img/logos/dropbox-square.svg';
import ownCloud from '../../renderer/styles/img/logos/owncloud.png';
import ownCloudSquare from '../../renderer/styles/img/logos/owncloud-square.svg';
import nextCloud from '../../renderer/styles/img/logos/nextcloud.svg';
import nextCloudSquare from '../../renderer/styles/img/logos/nextcloud-square.svg';
import fileSystemLogo from '../../renderer/styles/img/icons/disk-player.svg';
import webDAV from '../../renderer/styles/img/logos/webdav.png';
import { ArchiveTypes } from './types';

export const brands = {
  [ArchiveTypes.DROPBOX]: {
    name: 'Dropbox',
    logo: dropboxLogo,
    icon: dropboxLogoSquare
  },
  [ArchiveTypes.OWNCLOUD]: {
    name: 'OwnCloud',
    logo: ownCloud,
    icon: ownCloudSquare
  },
  [ArchiveTypes.NEXTCLOUD]: {
    name: 'Nextcloud',
    logo: nextCloud,
    icon: nextCloudSquare,
  },
  [ArchiveTypes.WEBDAV]: {
    name: 'WebDAV',
    logo: webDAV,
    icon: webDAV,
  },
  [ArchiveTypes.FILE]: {
    name: 'File System',
    logo: '',
    icon: fileSystemLogo
  }
};
