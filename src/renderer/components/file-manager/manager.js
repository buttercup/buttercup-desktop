import path from 'path';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import dimensions from 'react-dimensions';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { Translate } from '../../../shared/i18n';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import styles from '../../styles/file-manager';
import { TextCell, IconCell, SizeCell, DateCell } from './cells';

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
      pathToNavigate = path.posix.resolve(currentPath, fileObj.name);
    }

    this.fs.readDirectory(pathToNavigate, { mode: 'stat' }).then(result => {
      const files = result.map(item => ({
        name: item.name,
        type: item.isFile() ? 'file' : 'directory',
        size: item.size,
        mtime: item.mtime,
        isNew: false
      }));

      if (pathToNavigate !== '/') {
        files.unshift({ name: '..', type: 'directory', size: 0, mtime: null });
      }

      this.setSelectedFile(null);
      this.setState({
        currentPath: pathToNavigate,
        contents: sortContent(files)
      });
    });
  };

  handleCreateNewFile = () => {
    const { contents } = this.state;
    this.setState({
      contents: sortContent([
        {
          name: 'untitled.bcup',
          type: 'file',
          size: 0,
          mtime: new Date(),
          isNew: true,
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
    this.setState({
      contents: this.state.contents.map(item => {
        if (item.isNew) {
          return {
            ...item,
            name: `${fileName}.bcup`,
            editing: false,
            mtime: new Date().getTime()
          };
        }
        return item;
      })
    });
  };

  handleDismissFile = () => {
    this.setState({
      contents: this.state.contents.filter(item => !item.isNew)
    });
  };

  setSelectedFile(index) {
    this.setState({ selectedIndex: index });

    const file = this.state.contents[index] || null;
    const { onSelectFile } = this.props;

    if (onSelectFile) {
      onSelectFile(
        file ? path.posix.resolve(this.state.currentPath, file.name) : null,
        file ? file.isNew || false : null
      );
    }
  }

  render() {
    const { containerWidth, containerHeight } = this.props;
    const { contents, selectedIndex } = this.state;
    const scrollIndex = contents.findIndex(item => item.editing);

    return (
      <Table
        rowHeight={35}
        headerHeight={40}
        rowsCount={contents.length}
        rowClassNameGetter={index => {
          return selectedIndex === index ? styles.selected : null;
        }}
        scrollToRow={scrollIndex}
        width={containerWidth}
        height={containerHeight}
        onRowClick={this.handleRowClick}
        onRowDoubleClick={this.handleRowDoubleClick}
      >
        <Column
          columnKey="icon"
          header={<Cell />}
          cell={<IconCell data={contents} />}
          width={40}
          fixed
        />
        <Column
          columnKey="name"
          header={
            <Cell>
              {' '}
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
              {' '}
              <Translate i18nKey="cloud-source.size" parent="span" />
            </Cell>
          }
          cell={<SizeCell data={contents} />}
          width={100}
          fixed
        />
        <Column
          columnKey="mtime"
          header={
            <Cell>
              {' '}
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
