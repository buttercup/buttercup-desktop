import path from 'path';
import React, { PropTypes } from 'react';
import { Button } from 'buttercup-ui';
import SortIcon from 'react-icons/lib/md/sort';
import { showContextMenu } from '../../system/menu';

export default () => (
  <div>
    <Button
      dark
      onClick={() => {
        showContextMenu([
          {
            type: 'radio',
            checked: true,
            label: 'Sort Ascending',
            icon: path.resolve(__dirname, './resources/icons/az@2x.png')
          },
          {
            type: 'radio',
            checked: false,
            label: 'Sort Descending',
            icon: path.resolve(__dirname, './resources/icons/za@2x.png')
          },
          { type: 'separator' },
          {
            label: 'Last Accessed',
            icon: path.resolve(__dirname, './resources/icons/clock@2x.png')
          }
        ]);
      }}
      icon={<SortIcon/>}
      />
  </div>
);
