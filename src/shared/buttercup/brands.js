import dropboxLogo from '../../renderer/styles/img/logos/dropbox.svg';
import mybuttercupLogo from '../../renderer/styles/img/logos/mybuttercup.svg';
import googleDriveLogo from '../../renderer/styles/img/logos/googledrive.png';
import ownCloud from '../../renderer/styles/img/logos/owncloud.png';
import ownCloudSquare from '../../renderer/styles/img/logos/owncloud-square.svg';
import nextCloud from '../../renderer/styles/img/logos/nextcloud.svg';
import nextCloudSquare from '../../renderer/styles/img/logos/nextcloud-square.svg';
import webDAV from '../../renderer/styles/img/logos/webdav.png';
import { ArchiveTypes } from './types';

export const brands = {
  [ArchiveTypes.MY_BUTTERCUP]: {
    remote: true,
    name: 'My Buttercup',
    logo: mybuttercupLogo,
    icon: mybuttercupLogo,
    deprecated: false
  },
  [ArchiveTypes.DROPBOX]: {
    remote: true,
    name: 'Dropbox',
    logo: dropboxLogo,
    icon: dropboxLogo,
    deprecated: false
  },
  [ArchiveTypes.GOOGLEDRIVE]: {
    remote: true,
    name: 'Google Drive',
    logo: googleDriveLogo,
    icon: googleDriveLogo,
    deprecated: false
  },
  [ArchiveTypes.OWNCLOUD]: {
    remote: true,
    name: 'OwnCloud',
    logo: ownCloud,
    icon: ownCloudSquare,
    deprecated: true
  },
  [ArchiveTypes.NEXTCLOUD]: {
    remote: true,
    name: 'Nextcloud',
    logo: nextCloud,
    icon: nextCloudSquare,
    deprecated: true
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
