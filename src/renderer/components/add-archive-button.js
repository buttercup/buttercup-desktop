import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Button } from '@buttercup/ui';
import { MdAdd as ArchiveIcon } from 'react-icons/md';
import { showContextMenu } from '../system/menu';
import { getShortcutByKey } from '../../shared/utils/global-shortcuts';

const AddArchiveButton = ({
  condenced = false,
  onNewClick,
  onOpenClick,
  onCloudClick,
  globalShortcuts,
  t,
  ...props
}) => (
  <Button
    onClick={() =>
      showContextMenu([
        {
          label: t('intro-menu.open-archive-file'),
          accelerator: getShortcutByKey(
            'app-menu.archive.open',
            globalShortcuts
          ),
          click: onOpenClick
        },
        {
          label: t('intro-menu.new-archive-file'),
          accelerator: getShortcutByKey('entry.add-entry', globalShortcuts),
          click: onNewClick
        },
        {
          label: t('intro-menu.connect-cloud-sources'),
          accelerator: getShortcutByKey(
            'app-menu.archive.connect-cloud-sources',
            globalShortcuts
          ),
          click: onCloudClick
        }
      ])
    }
    icon={<ArchiveIcon />}
    {...props}
  >
    {condenced ? ' ' : t('archive.add-archive')}
  </Button>
);

AddArchiveButton.propTypes = {
  condenced: PropTypes.bool,
  onOpenClick: PropTypes.func,
  onNewClick: PropTypes.func,
  onCloudClick: PropTypes.func,
  globalShortcuts: PropTypes.object,
  t: PropTypes.func
};

export default translate()(AddArchiveButton);
