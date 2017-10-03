import PropTypes from 'prop-types';
import React from 'react';
import SortIcon from 'react-icons/lib/md/sort';
import { Button } from '@buttercup/ui';
import { showContextMenu, createSortMenu } from '../../system/menu';

const SORT_MODES = [
  [
    {
      mode: 'properties.title-asc',
      label: 'Title: Ascending',
      icon: 'sort-alpha-asc',
      enabled: true
    },
    {
      mode: 'properties.title-desc',
      label: 'Title: Descending',
      icon: 'sort-alpha-desc',
      enabled: true
    }
  ],
  [
    {
      mode: 'time-desc',
      label: 'Time: Descending',
      icon: 'sort-time-desc',
      enabled: false
    },
    {
      mode: 'time-desc',
      label: 'Time: Descending',
      icon: 'sort-time-desc',
      enabled: false
    }
  ]
];

function showMenu(mode, onChange) {
  showContextMenu(createSortMenu(SORT_MODES, mode, onChange));
}

const SortButton = ({ mode, onChange }) => (
  <Button
    transparent
    onClick={() => showMenu(mode, onChange)}
    icon={<SortIcon />}
  />
);

SortButton.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SortButton;
