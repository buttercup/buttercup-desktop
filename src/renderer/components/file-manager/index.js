import path from 'path';
import humanize from 'humanize';
import React, { Component, PropTypes } from 'react';
import Dimensions from 'react-dimensions';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table/dist/fixed-data-table.css';

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

const DateCell = ({rowIndex, data, ...props}) => (
  <Cell {...props}>
    {data[rowIndex].mtime ? humanize.date('d M', data[rowIndex].mtime) : ''}
  </Cell>
);

const SizeCell = ({rowIndex, data, ...props}) => (
  <Cell {...props}>
    {humanize.filesize(data[rowIndex].size)}
  </Cell>
);

const IconCell = ({rowIndex, data, ...props}) => {
  let ext = path.extname(data[rowIndex].name);
  ext = ext ? ext.toLowerCase().replace('.', '') : null;
  return (
    <Cell {...props}>
      {data[rowIndex].type === 'directory' ?
        'Directory' :
        <img src={`/icons/document-file-${ext}.svg`} width="30"/>
      }
    </Cell>
  );
};

class FileManager extends Component {
  componentDidMount() {
    this.props.handleNavigate('/');
  }

  handleRowDoubleClick(e, index) {
    const p = path.resolve(this.props.currentPath, this.props.contents[index].name);
    this.props.handleNavigate(p);
  }

  render() {
    const { currentPath, contents, containerWidth, containerHeight } = this.props;
    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={contents.length}
        width={containerWidth}
        height={containerHeight}
        onRowDoubleClick={(...args) => this.handleRowDoubleClick(...args)}
        >
        <Column
          header={<Cell/>}
          cell={<IconCell data={contents}/>}
          width={100}
          fixed
          />
        <Column
          header={<Cell>Name</Cell>}
          cell={<TextCell data={contents} col="name"/>}
          fixed
          flexGrow={2}
          width={200}
          />
        <Column
          header={<Cell>Size</Cell>}
          cell={<SizeCell data={contents}/>}
          width={100}
          fixed
          />
        <Column
          header={<Cell>Date</Cell>}
          cell={<DateCell data={contents}/>}
          width={100}
          fixed
          />
      </Table>
    );
  }
}

FileManager.propTypes = {
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
  currentPath: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  handleNavigate: PropTypes.func,
  handleSelectCurrentPath: PropTypes.func,
  handleCreateNewDirectory: PropTypes.func
};

export default Dimensions()(FileManager);
