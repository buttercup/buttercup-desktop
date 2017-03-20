import path from 'path';
import webdavFs from 'webdav-fs';
import anyFs from 'any-fs';
import React, { Component, PropTypes } from 'react';
import dimensions from 'react-dimensions';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import styles from '../../styles/file-manager';
import { TextCell, IconCell, SizeCell, DateCell } from './cells';

const afs = anyFs(wfs);

class Manager extends Component {
  state = {
    currentPath: '/',
    contents: [],
    selectedIndex: null,
    selectedPath: null
  };

  navigate = index => {
    const { currentPath, contents } = this.state;
    let pathToNavigate = '/';

    if (index !== null) {
      pathToNavigate = path.resolve(currentPath, contents[index].name);
    }

    this.setState({ currentPath: pathToNavigate });

    afs.readDirectory(pathToNavigate).then(result => {
      const files = result.map(item => ({
        name: item.name,
        type: item.isFile() ? 'file' : 'directory',
        size: item.size,
        mtime: item.mtime
      }));

      if (pathToNavigate !== '/') {
        files.unshift({ name: '..', type: 'directory', size: 0, mtime: null });
      }

      this.setState({ contents: files });
    });
  }

  componentDidMount() {
    this.navigate(null);
  }

  handleRowClick = (e, index) => {
    this.setState({ selectedIndex: index });
  }

  handleRowDoubleClick = (e, index) => {
    this.navigate(index);
  }

  render() {
    const { containerWidth, containerHeight } = this.props;
    const { contents, selectedIndex } = this.state;

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
  containerHeight: PropTypes.number
};

Manager.propTypes = propTypes;

export default dimensions({
  elementResize: true
})(Manager);
