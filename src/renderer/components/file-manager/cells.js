import path from 'path';
import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table-2';
import humanize from 'humanize';
import Icon from '../icon';
import styles from '../../styles/file-manager';

const propTypes = {
  rowIndex: PropTypes.number,
  col: PropTypes.string,
  data: PropTypes.array,
  selectedIndex: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.any
};

export const TextCell = ({ rowIndex, data, col, ...props }) => (
  <Cell className={styles.cell} {...props}>
    {data[rowIndex][col]}
  </Cell>
);
TextCell.propTypes = propTypes;

export const DateCell = ({ rowIndex, data, ...props }) => (
  <Cell className={styles.cell} {...props}>
    {data[rowIndex].mtime ? humanize.date('d M', data[rowIndex].mtime) : ''}
  </Cell>
);
DateCell.propTypes = propTypes;

export const SizeCell = ({ rowIndex, data, ...props }) => (
  <Cell className={styles.cell} {...props}>
    {data[rowIndex].size > 0 ? humanize.filesize(data[rowIndex].size) : null}
  </Cell>
);
SizeCell.propTypes = propTypes;

export const IconCell = ({ rowIndex, data, ...props }) => {
  let ext = path.extname(data[rowIndex].name);
  ext = ext ? ext.toLowerCase().replace('.', '') : null;
  return (
    <Cell className={styles.cell} {...props}>
      <Icon name={data[rowIndex].type === 'directory' ? 'folder' : `document-file-${ext}`} size={20}/>
    </Cell>
  );
};
IconCell.propTypes = propTypes;
