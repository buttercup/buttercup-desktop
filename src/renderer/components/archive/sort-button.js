import PropTypes from 'prop-types';
import React from 'react';
import SortIcon from 'react-icons/lib/md/sort';
import { Button } from '@buttercup/ui';
import { injectIntl, intlShape } from 'react-intl';
import { showContextMenu, createSortMenu } from '../../system/menu';

function showMenu(mode, onChange, intl) {
  showContextMenu(
    createSortMenu(
      [
        [
          {
            mode: 'properties.title-asc',
            label: intl.formatMessage({
              id: 'title-asc',
              defaultMessage: 'Title: Ascending'
            }),
            icon: 'sort-alpha-asc',
            enabled: true
          },
          {
            mode: 'properties.title-desc',
            label: intl.formatMessage({
              id: 'title-desc',
              defaultMessage: 'Title: Descending'
            }),
            icon: 'sort-alpha-desc',
            enabled: true
          }
        ],
        [
          {
            mode: 'time-asc',
            label: intl.formatMessage({
              id: 'time-asc',
              defaultMessage: 'Time: Ascending'
            }),
            icon: 'sort-time-asc',
            enabled: false
          },
          {
            mode: 'time-desc',
            label: intl.formatMessage({
              id: 'time-desc',
              defaultMessage: 'Time: Descending'
            }),
            icon: 'sort-time-desc',
            enabled: false
          }
        ]
      ],
      mode,
      onChange
    )
  );
}

const SortButton = ({ mode, onChange, intl }) => (
  <Button
    transparent
    onClick={() => showMenu(mode, onChange, intl)}
    icon={<SortIcon />}
  />
);

SortButton.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(SortButton);
