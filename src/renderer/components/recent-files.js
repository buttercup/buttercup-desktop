import React, { Component, PropTypes } from 'react';
import DeleteIcon from 'react-icons/lib/ti/delete-outline';
import HistoryIcon from 'react-icons/lib/go/history';
import CloudIcon from 'react-icons/lib/md/cloud-queue';
import DropboxIcon from 'react-icons/lib/fa/dropbox';
import LaptopIcon from 'react-icons/lib/md/laptop-mac';
import { Button } from 'buttercup-ui';
import { ArchiveTypes } from '../../shared/buttercup/types';
import styles from '../styles/recent-files';
import { parsePath } from '../system/utils';
import { showContextMenu } from '../system/menu';
import EmptyView from './empty-view';

function getIcon(type) {
  switch (type) {
    case ArchiveTypes.OWNCLOUD:
    case ArchiveTypes.WEBDAV:
      return <CloudIcon/>;
    case ArchiveTypes.DROPBOX:
      return <DropboxIcon/>;
    default:
      return <LaptopIcon/>;
  }
}

const File = ({archive, onClick, onRemoveClick}) => {
  const { base, dir } = parsePath(archive.path);
  return (
    <li
      onContextMenu={e => {
        e.stopPropagation();
        showContextMenu([{
          label: `Open ${base}`,
          click: onClick
        }, {
          label: `Remove ${base} from history`,
          click: onRemoveClick
        }]);
      }}
      >
      <div onClick={onClick} className={styles.fileInfo}>
        <span>{base}</span>
        <span>{getIcon(archive.type)} {dir}</span>
      </div>
      <span onClick={onRemoveClick} className={styles.remove}><DeleteIcon/></span>
    </li>
  );
};

File.propTypes = {
  archive: PropTypes.object,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

class RecentFiles extends Component {
  showContextMenu() {
    showContextMenu([
      {
        label: 'Clear History',
        click: this.props.onClearClick
      }
    ]);
  }

  renderEmptyState() {
    return (
      <div className={styles.container}>
        <EmptyView caption="No archives yet."/>
      </div>
    );
  }

  render() {
    const { archives } = this.props;
    
    if (archives.length === 0) {
      return this.renderEmptyState();
    }

    return (
      <div className={styles.container} onContextMenu={() => this.showContextMenu()}>
        <h6 className={styles.heading}>History:</h6>
        <ul className={styles.list}>
          {archives.map(archive =>
            <File
              archive={archive}
              key={archive.id}
              onClick={() => this.props.onClick(archive)}
              onRemoveClick={() => this.props.onRemoveClick(archive.id)}
              />
          )}
        </ul>
        <Button onClick={() => this.props.onClearClick()} icon={<HistoryIcon/>}>Clear History</Button>
      </div>
    );
  }
}

RecentFiles.propTypes = {
  archives: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onClick: PropTypes.func
};

export default RecentFiles;
