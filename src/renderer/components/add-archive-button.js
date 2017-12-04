import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Button } from '@buttercup/ui';
import ArchiveIcon from 'react-icons/lib/md/add';
import { showContextMenu } from '../system/menu';

const AddArchiveButton = ({
  condenced = false,
  onNewClick,
  onOpenClick,
  onCloudClick,
  t,
  ...props
}) => (
  <Button
    onClick={() =>
      showContextMenu([
        {
          label: t('intro-menu.open-archive-file'),
          accelerator: 'CmdOrCtrl+O',
          click: onOpenClick
        },
        {
          label: t('intro-menu.new-archive-file'),
          accelerator: 'CmdOrCtrl+N',
          click: onNewClick
        },
        {
          label: t('intro-menu.connect-cloud-sources'),
          accelerator: 'CmdOrCtrl+Shift+C',
          click: onCloudClick
        }
      ])}
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
  t: PropTypes.func
};

export default translate()(AddArchiveButton);
