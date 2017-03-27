import React, { Component, PropTypes } from 'react';
import DeleteIcon from 'react-icons/lib/ti/delete-outline';
import HistoryIcon from 'react-icons/lib/go/history';
import { Button } from 'buttercup-ui';
import styles from '../styles/recent-files';
import { parsePath } from '../system/utils';
import { showContextMenu } from '../system/menu';
import EmptyView from './empty-view';

const File = ({filename, onClick, onRemoveClick}) => {
  const { base, dir } = parsePath(filename);
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
        <span>{dir}</span>
      </div>
      <span onClick={onRemoveClick} className={styles.remove}><DeleteIcon/></span>
    </li>
  );
};

File.propTypes = {
  filename: PropTypes.string,
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
    const { recentFiles } = this.props;
    
    if (recentFiles.length === 0) {
      return this.renderEmptyState();
    }

    return (
      <div className={styles.container} onContextMenu={() => this.showContextMenu()}>
        <h6 className={styles.heading}>History:</h6>
        <ul className={styles.list}>
          {recentFiles.map(archive =>
            <File
              filename={archive.path}
              key={archive.id}
              onClick={() => this.props.onClick(archive.path)}
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
  recentFiles: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onClick: PropTypes.func
};

export default RecentFiles;
