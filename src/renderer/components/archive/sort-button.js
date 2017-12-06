import PropTypes from 'prop-types';
import React from 'react';
import SortIcon from 'react-icons/lib/md/sort';
import { Button } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { showContextMenu, createSortMenu } from '../../system/menu';

function showMenu(mode, onChange, t) {
  showContextMenu(
    createSortMenu(
      [
        [
          {
            mode: 'properties.title-asc',
            label: t('sort.title-asc'),
            icon: 'sort-alpha-asc',
            enabled: true
          },
          {
            mode: 'properties.title-desc',
            label: t('sort.title-desc'),
            icon: 'sort-alpha-desc',
            enabled: true
          }
        ],
        [
          {
            mode: 'time-asc',
            label: t('sort.time-asc'),
            icon: 'sort-time-asc',
            enabled: false
          },
          {
            mode: 'time-desc',
            label: t('sort.time-desc'),
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

const SortButton = ({ mode, onChange, t }) => (
  <Button
    transparent
    onClick={() => showMenu(mode, onChange, t)}
    icon={<SortIcon />}
  />
);

SortButton.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate()(SortButton);
