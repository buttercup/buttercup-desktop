import path from 'path';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Input } from '@buttercup/ui';
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

class NewFileInput extends PureComponent {
  state = {
    name: ''
  };

  static propTypes = {
    onSaveFile: PropTypes.func,
    onDismissFile: PropTypes.func
  };

  handleChange = e => {
    const name = e.target.value;
    if (/[\\/:+@]/.test(name)) {
      return;
    }
    this.setState({
      name
    });
  };

  handleBlur = () => {
    this.props.onDismissFile();
  };

  handleSubmit = () => {
    let { name } = this.state;
    name = name
      .trim()
      .replace(/\.bcup$/, '')
      .trim();
    if (name.length === 0) {
      return;
    }
    this.props.onSaveFile(name);
  };

  handleKeyup = e => {
    e.stopPropagation();
    switch (e.which) {
      case 27: // ESC Key
        this.handleBlur();
        break;
      case 13: // Return Key
        this.handleSubmit();
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    if (this.ref) {
      this.ref.select();
    }
  }

  render() {
    return (
      <Input
        onChange={this.handleChange}
        onKeyUp={this.handleKeyup}
        onBlur={this.handleBlur}
        value={this.state.name}
        innerRef={ref => {
          this.ref = ref;
        }}
      />
    );
  }
}

export const TextCell = ({
  rowIndex,
  data,
  col,
  onSaveFile,
  onDismissFile,
  ...props
}) => {
  const item = data[rowIndex];
  if (item.editing) {
    return (
      <NewFileInput onSaveFile={onSaveFile} onDismissFile={onDismissFile} />
    );
  }
  return (
    <Cell className={styles.cell} {...props}>
      {item[col]}
    </Cell>
  );
};

TextCell.propTypes = {
  ...propTypes,
  onSaveFile: PropTypes.func,
  handleDismissFile: PropTypes.func
};

export const DateCell = ({ rowIndex, data, ...props }) => (
  <Cell className={styles.cell} {...props}>
    {data[rowIndex].mtime ? humanize.date('d M', data[rowIndex].mtime) : ''}
  </Cell>
);
DateCell.propTypes = propTypes;

export const SizeCell = ({ rowIndex, data, ...props }) => (
  <Cell className={styles.cell} {...props}>
    {humanize.filesize(data[rowIndex].size)}
  </Cell>
);
SizeCell.propTypes = propTypes;

export const IconCell = ({ rowIndex, data, ...props }) => {
  let ext = path.extname(data[rowIndex].name);
  ext = ext ? ext.toLowerCase().replace('.', '') : null;
  return (
    <Cell className={styles.cell} {...props}>
      <Icon
        name={
          data[rowIndex].type === 'directory'
            ? 'folder'
            : `document-file-${ext}`
        }
        size={20}
      />
    </Cell>
  );
};
IconCell.propTypes = propTypes;
