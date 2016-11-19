import path from 'path';
import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';
import cx from 'classnames';
import humanize from 'humanize';
import Icon from '../icon';
import styles from '../../styles/file-manager';

const propTypes = {
  rowIndex: PropTypes.number,
  col: PropTypes.string,
  data: PropTypes.array,
  selectedIndex: PropTypes.number 
};

export const TextCell = ({rowIndex, data, col, selectedIndex, ...props}) => (
  <Cell className={cx(rowIndex === selectedIndex ? styles.selected : null)} {...props}>
    {data[rowIndex][col]}
  </Cell>
);
TextCell.propTypes = propTypes;

export const DateCell = ({rowIndex, data, selectedIndex, ...props}) => (
  <Cell className={cx(rowIndex === selectedIndex ? styles.selected : null)} {...props}>
    {data[rowIndex].mtime ? humanize.date('d M', data[rowIndex].mtime) : ''}
  </Cell>
);
DateCell.propTypes = propTypes;

export const SizeCell = ({rowIndex, data, selectedIndex, ...props}) => (
  <Cell className={cx(rowIndex === selectedIndex ? styles.selected : null)} {...props}>
    {data[rowIndex].size > 0 ? humanize.filesize(data[rowIndex].size) : null}
  </Cell>
);
SizeCell.propTypes = propTypes;

export const IconCell = ({rowIndex, data, selectedIndex, ...props}) => {
  let ext = path.extname(data[rowIndex].name);
  ext = ext ? ext.toLowerCase().replace('.', '') : null;
  return (
    <Cell className={cx(rowIndex === selectedIndex ? styles.selected : null)} {...props}>
      {data[rowIndex].type === 'directory' ?
        <Icon name="folder" size={24}/> :
        <Icon name={`document-file-${ext}`} size={24}/>
      }
    </Cell>
  );
};
IconCell.propTypes = propTypes;

