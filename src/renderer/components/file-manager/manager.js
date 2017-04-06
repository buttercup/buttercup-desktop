import path from 'path';
import React, { Component, PropTypes } from 'react';
import dimensions from 'react-dimensions';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import styles from '../../styles/file-manager';
import { TextCell, IconCell, SizeCell, DateCell } from './cells';

class Manager extends Component {
  static propTypes = {
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    onSelectFile: PropTypes.func,
    fs: PropTypes.object
  };

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
      const fileObj = contents[index];
      if (fileObj.type !== 'directory') {
        return;
      }
      pathToNavigate = path.resolve(currentPath, fileObj.name);
    }

    this.fs.readDirectory(pathToNavigate, { mode: 'stat' }).then(result => {
      const files = result.map(item => ({
        name: item.name,
        type: item.isFile() ? 'file' : 'directory',
        size: item.size,
        mtime: item.mtime
      }));

      if (pathToNavigate !== '/') {
        files.unshift({ name: '..', type: 'directory', size: 0, mtime: null });
      }

      this.setSelectedFile(null);
      this.setState({
        currentPath: pathToNavigate,
        contents: files
      });
    });
  }

  componentDidMount() {
    this.fs = this.props.fs;
    this.navigate(null);
  }

  handleRowClick = (e, index) => {
    this.setSelectedFile(index);
  }

  handleRowDoubleClick = (e, index) => {
    this.navigate(index);
  }

  setSelectedFile(index) {
    this.setState({ selectedIndex: index });

    const file = this.state.contents[index] || null;
    const { onSelectFile } = this.props;

    if (onSelectFile) {
      onSelectFile(file ? path.resolve(this.state.currentPath, file.name) : null);
    }
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

export default dimensions({
  elementResize: true
})(Manager);
