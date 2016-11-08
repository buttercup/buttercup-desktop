import React, { Component, PropTypes } from 'react';
import DeleteIcon from 'react-icons/lib/ti/delete-outline';
import HistoryIcon from 'react-icons/lib/go/history';
import styles from '../styles/recent-files';
import { parsePath } from '../system/utils';
import { showContextMenu } from '../system/menu';
import Button from './button';

const File = ({filename, onClick, onRemoveClick}) => {
  const { base, dir } = parsePath(filename);
  return (
    <li
      onContextMenu={e => {
        e.stopPropagation();
        showContextMenu([{
          label: `Remove ${base} from recents...`,
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
        label: 'Clear History...',
        click: this.props.onClearClick
      }
    ]);
  }

  render() {
    return (
      <div className={styles.container} onContextMenu={() => this.showContextMenu()}>
        <h6 className={styles.heading}>Recent Archives:</h6>
        <ul className={styles.list}>
          {this.props.recentFiles.map(filename =>
            <File
              filename={filename}
              key={filename}
              onClick={() => this.props.onClick(filename)}
              onRemoveClick={() => this.props.onRemoveClick(filename)}
              />
          )}
        </ul>
        <Button onClick={this.props.onClearClick} icon={<HistoryIcon/>}>Clear History</Button>
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
