import path from 'path';
import React, { PropTypes } from 'react';
import SortIcon from 'react-icons/lib/md/sort';
import { showContextMenu } from '../../system/menu';
import { Button } from 'buttercup-ui';

const SORT_MODES = [
  {
    mode: 'title-asc',
    label: 'Title: Ascending',
    icon: 'sort-alpha-asc',
    enabled: true
  },
  {
    mode: 'title-desc',
    label: 'Title: Descending',
    icon: 'sort-alpha-desc',
    enabled: true
  },
  null,
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
];

function showMenu(mode, onChange) {
  showContextMenu(
    SORT_MODES.map(
      sort => (sort ? {
        type: 'checkbox',
        checked: mode === sort.mode,
        label: sort.label,
        enabled: sort.enabled,
        icon: path.resolve(__dirname, `./resources/icons/${sort.icon}.png`),
        click: () => onChange(sort.mode)
      } : { type: 'separator' })
    )
  );
} 

const SortButton = ({ mode, onChange }) => (
  <Button
    transparent
    onClick={() => showMenu(mode, onChange)}
    icon={<SortIcon/>}
    />
);

SortButton.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SortButton;
