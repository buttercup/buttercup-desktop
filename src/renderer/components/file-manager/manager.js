import path from 'path';
import React, { Component, PropTypes } from 'react';
import dimensions from 'react-dimensions';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import styles from '../../styles/file-manager';
import { TextCell, IconCell, SizeCell, DateCell } from './cells';

class Manager extends Component {
  componentDidMount() {
    this.props.handleNavigate(null);
  }

  handleRowClick = (e, index) => {
    this.props.handleSelectIndex(index);
  }

  handleRowDoubleClick = (e, index) => {
    this.props.handleNavigate(index);
  }

  render() {
    const { contents, containerWidth, containerHeight, selectedIndex } = this.props;
    return (
      <Table
        rowHeight={35}
        headerHeight={40}
        rowsCount={contents.length}
        rowClassNameGetter={index => {
          const item = contents[index];
          if (item.type !== 'directory' && path.extname(item.name).toLowerCase() !== '.bcup') {
            return styles.disabled;
          }
          return selectedIndex === index ? styles.selected : null;
        }}
        width={containerWidth}
        height={containerHeight}
        onRowClick={this.handleRowClick}
        onRowDoubleClick={this.handleRowDoubleClick}
        >
        <Column
          columnKey="icon"
          header={<Cell/>}
          cell={<IconCell data={contents}/>}
          width={40}
          fixed
          />
        <Column
          columnKey="name"
          header={<Cell>Name</Cell>}
          cell={<TextCell data={contents} col="name"/>}
          fixed
          flexGrow={2}
          width={200}
          />
        <Column
          columnKey="size"
          header={<Cell>Size</Cell>}
          cell={<SizeCell data={contents}/>}
          width={100}
          fixed
          />
        <Column
          columnKey="mtime"
          header={<Cell>Date</Cell>}
          cell={<DateCell data={contents}/>}
          width={100}
          fixed
          />
      </Table>
    );
  }
}

export const propTypes = {
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
  selectedIndex: PropTypes.number,
  selectFile: PropTypes.object,
  currentPath: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  handleNavigate: PropTypes.func,
  handleCreateNewDirectory: PropTypes.func,
  handleSelectIndex: PropTypes.func
};

Manager.propTypes = propTypes;

export default dimensions({
  elementResize: true
})(Manager);
