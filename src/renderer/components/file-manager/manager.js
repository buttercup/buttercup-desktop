import path from 'path';
import React, { Component, PropTypes } from 'react';
import Dimensions from 'react-dimensions';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import styles from '../../styles/file-manager';
import { TextCell, IconCell, SizeCell, DateCell } from './cells';

class Manager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null
    };
  }

  componentDidMount() {
    this.props.handleNavigate('/');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contents !== this.props.contents) {
      this.setState({selectedIndex: null});
    }
  }

  handleRowClick(e, index) {
    this.setState({selectedIndex: index});
  }

  handleRowDoubleClick(e, index) {
    const { currentPath, contents } = this.props;
    const pathToNavigate = path.resolve(currentPath, contents[index].name);
    this.props.handleNavigate(pathToNavigate);
  }

  render() {
    const { contents, containerWidth, containerHeight } = this.props;
    const { selectedIndex } = this.state;
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
        onRowClick={(...args) => this.handleRowClick(...args)}
        onRowDoubleClick={(...args) => this.handleRowDoubleClick(...args)}
        onColumnResizeEndCallback={(...args) => this.handleColumnResizeEnd(...args)}
        >
        <Column
          columnKey="icon"
          header={<Cell/>}
          cell={<IconCell data={contents} selectedIndex={selectedIndex}/>}
          width={40}
          fixed
          />
        <Column
          columnKey="name"
          header={<Cell>Name</Cell>}
          cell={<TextCell data={contents} col="name" selectedIndex={selectedIndex}/>}
          fixed
          flexGrow={2}
          width={200}
          />
        <Column
          columnKey="size"
          header={<Cell>Size</Cell>}
          cell={<SizeCell data={contents} selectedIndex={selectedIndex}/>}
          width={100}
          fixed
          />
        <Column
          columnKey="mtime"
          header={<Cell>Date</Cell>}
          cell={<DateCell data={contents} selectedIndex={selectedIndex}/>}
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
  currentPath: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  handleNavigate: PropTypes.func,
  handleSelectCurrentPath: PropTypes.func,
  handleCreateNewDirectory: PropTypes.func
};

Manager.propTypes = propTypes;

export default Dimensions({
  elementResize: true
})(Manager);
