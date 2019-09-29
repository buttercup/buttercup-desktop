import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import dimensions from 'react-dimensions';
import styled from 'styled-components';
import { Table as BaseTable, Column, Cell } from 'fixed-data-table-2';
import { Translate } from '../../../shared/i18n';
import spinner from '../../styles/img/spinner-dark.svg';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import { TextCell, IconCell, SizeCell, DateCell } from './cells';

const Table = styled(BaseTable)`
  .public_fixedDataTable_main {
    border-width: 0;
  }
  .selected,
  .selected .public_fixedDataTableCell_main {
    background: var(--brand-primary) !important;
    color: #fff;
  }
`;

const Spinner = styled.img`
  position: relative;
  top: -5px;
  left: -5px;
`;

function sortContent(list) {
  const folders = list.filter(item => item.type === 'directory');
  const files = list.filter(item => item.type === 'file' && !item.editing);
  const newFile = list.filter(item => item.editing);

  return [...folders, ...newFile, ...files];
}

class Manager extends PureComponent {
  static propTypes = {
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    onSelectFile: PropTypes.func,
    toggleCreateButton: PropTypes.func,
    fs: PropTypes.object
  };

  state = {
    contents: [],
    selectedIndex: null,
    currentPath: null,
    isLoading: false
  };

  navigate = index => {
    const { contents } = this.state;
    let pathToNavigate = null;

    if (index !== null) {
      const fileObj = contents[index];
      if (fileObj.type !== 'directory') {
        return;
      }
      pathToNavigate = fileObj;
    }
    this.setState({
      isLoading: true
    });

    this.fs
      .getDirectoryContents(
        pathToNavigate && pathToNavigate.identifier ? pathToNavigate : null
      )
      .then(results => {
        let files = sortContent(results);

        if (pathToNavigate && pathToNavigate.identifier) {
          files = [
            {
              ...(pathToNavigate.parent || {
                identifier: null
              }),
              name: '..',
              type: 'directory'
            },
            ...files
          ];
        }
        this.setSelectedFile(null);
        this.setState({
          contents: files,
          currentPath: pathToNavigate,
          isLoading: false
        });
      });
  };

  handleCreateNewFile = () => {
    const { contents } = this.state;
    this.setState({
      contents: sortContent([
        {
          identifier: null,
          name: 'untitled.bcup',
          type: 'file',
          size: 0,
          modified: new Date().toUTCString(),
          editing: true
        },
        ...contents
      ])
    });
  };

  componentDidMount() {
    this.fs = this.props.fs;
    this.navigate(null);
    this.props.toggleCreateButton(true);

    // I am so sorry :(
    document.addEventListener('new-archive-clicked', this.handleCreateNewFile);
  }

  componentWillUnmount() {
    this.props.toggleCreateButton(false);
    document.removeEventListener(
      'new-archive-clicked',
      this.handleCreateNewFile
    );
  }

  handleRowClick = (e, index) => {
    if (this.state.contents.findIndex(item => item.editing) > -1) {
      return;
    }
    this.setSelectedFile(index);
  };

  handleRowDoubleClick = (e, index) => {
    this.navigate(index);
  };

  handleSaveFile = fileName => {
    const { currentPath, contents } = this.state;
    const fileNameWithExt = `${fileName}.bcup`;
    this.setState({ isLoading: true });
    this.fs
      .putFileContents(
        {
          identifier:
            currentPath && currentPath.identifier
              ? currentPath.identifier
              : null
        },
        {
          identifier: null,
          name: fileNameWithExt
        },
        ''
      )
      .then(fileObj => {
        this.setState({
          isLoading: false,
          contents: contents.map(item => {
            if (item.editing) {
              return {
                ...item,
                ...fileObj,
                editing: false
              };
            }
            return item;
          })
        });
      });
  };

  handleDismissFile = () => {
    this.setState({
      contents: this.state.contents.filter(item => !item.editing)
    });
  };

  setSelectedFile(index) {
    this.setState({ selectedIndex: index });

    const file = this.state.contents[index] || null;
    const { onSelectFile } = this.props;

    if (onSelectFile && file) {
      onSelectFile(file);
    }
  }

  render() {
    const { containerWidth, containerHeight } = this.props;
    const { contents, selectedIndex, isLoading } = this.state;
    const scrollIndex = contents.findIndex(item => item.editing);

    return (
      <Table
        rowHeight={35}
        headerHeight={40}
        rowsCount={contents.length}
        rowClassNameGetter={index => {
          return selectedIndex === index ? 'selected' : null;
        }}
        scrollToRow={scrollIndex}
        width={containerWidth}
        height={containerHeight}
        onRowClick={this.handleRowClick}
        onRowDoubleClick={this.handleRowDoubleClick}
      >
        <Column
          columnKey="icon"
          header={
            <Cell>{isLoading ? <Spinner src={spinner} width={32} /> : ''}</Cell>
          }
          cell={<IconCell data={contents} />}
          width={40}
          fixed
        />
        <Column
          columnKey="name"
          header={
            <Cell>
              <Translate i18nKey="cloud-source.name" parent="span" />
            </Cell>
          }
          cell={
            <TextCell
              data={contents}
              col="name"
              onSaveFile={this.handleSaveFile}
              onDismissFile={this.handleDismissFile}
            />
          }
          fixed
          flexGrow={2}
          width={200}
        />
        <Column
          columnKey="size"
          header={
            <Cell>
              <Translate i18nKey="cloud-source.size" parent="span" />
            </Cell>
          }
          cell={<SizeCell data={contents} />}
          width={100}
          fixed
        />
        <Column
          columnKey="modified"
          header={
            <Cell>
              <Translate i18nKey="cloud-source.date" parent="span" />
            </Cell>
          }
          cell={<DateCell data={contents} />}
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
