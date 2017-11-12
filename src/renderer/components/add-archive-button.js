import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Button } from '@buttercup/ui';
import ArchiveIcon from 'react-icons/lib/md/add';
import { showContextMenu } from '../system/menu';

const AddArchiveButton = ({
  condenced = false,
  onNewClick,
  onOpenClick,
  onCloudClick,
  intl,
  ...props
}) => (
  <Button
    onClick={() =>
      showContextMenu([
        {
          label: intl.formatMessage({
            id: 'components.add-archive-button.open_archive_file'
          }),
          accelerator: 'CmdOrCtrl+O',
          click: onOpenClick
        },
        {
          label: intl.formatMessage({
            id: 'components.add-archive-button.new_archive_file'
          }),
          accelerator: 'CmdOrCtrl+N',
          click: onNewClick
        },
        {
          label: intl.formatMessage({
            id: 'components.add-archive-button.connect_cloud_sources'
          }),
          accelerator: 'CmdOrCtrl+Shift+C',
          click: onCloudClick
        }
      ])}
    icon={<ArchiveIcon />}
    {...props}
  >
    {condenced
      ? ''
      : intl.formatMessage({ id: 'components.add-archive-button.add_archive' })}
  </Button>
);

AddArchiveButton.propTypes = {
  condenced: PropTypes.bool,
  onOpenClick: PropTypes.func,
  onNewClick: PropTypes.func,
  onCloudClick: PropTypes.func,
  intl: intlShape.isRequired
};

export default injectIntl(AddArchiveButton);
