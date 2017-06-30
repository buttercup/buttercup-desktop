import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryIcon from 'react-icons/lib/go/history';
import { Button } from '@buttercup/ui';
import styled from 'styled-components';
import { brands } from '../../shared/buttercup/brands';
import styles from '../styles/recent-files';
import { showContextMenu } from '../system/menu';
import EmptyView from './empty-view';
import Column from './column';

const Wrapper = styled.div`
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--sidebar-bg);
  display: flex;
`;

const File = ({ archive, onUnlockClick, onClick, onRemoveClick }) => {
  // const { base, dir } = parsePath(archive.path);
  const { name } = archive;
  return (
    <li
      onContextMenu={e => {
        e.stopPropagation();
        showContextMenu([{
          label: `Unlock ${name}`,
          click: onUnlockClick
        }, {
          label: `Remove ${name} from Buttercup`,
          click: onRemoveClick
        }]);
      }}
      >
      <div onClick={onClick} className={styles.fileInfo}>
        <figure>
          <img src={brands[archive.type].icon} />
        </figure>
        <section>
          <div>{name}</div>
          {/*<div className='path'>{dir}</div>*/}
        </section>
      </div>
    </li>
  );
};

File.propTypes = {
  archive: PropTypes.object,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  onUnlockClick: PropTypes.func
};

class RecentFiles extends Component {
  static propTypes = {
    archives: PropTypes.array,
    onRemoveClick: PropTypes.func,
    onUnlockClick: PropTypes.func,
    onOpenClick: PropTypes.func,
    onNewClick: PropTypes.func,
    onCloudClick: PropTypes.func,
    onClick: PropTypes.func
  };

  showCreateMenu = () => {
    showContextMenu([
      {
        label: 'Open Archive File',
        accelerator: 'CmdOrCtrl+O',
        click: this.props.onOpenClick
      },
      {
        label: 'New Archive File',
        accelerator: 'CmdOrCtrl+N',
        click: this.props.onNewClick
      },
      {
        label: 'Connect Cloud Sources',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: this.props.onCloudClick
      }
    ]);
  }

  renderEmptyState() {
    return (
      <div className={styles.emptyContainer}>
        <EmptyView caption="No archives yet." />
      </div>
    );
  }

  render() {
    const { archives } = this.props;

    // if (archives.length === 0) {
    //   return this.renderEmptyState();
    // }

    const footer = (
      <Button
        dark
        full
        onClick={this.showCreateMenu}
        icon={<HistoryIcon />}
        >
        Add Archive
      </Button>
    );

    return (
      <Wrapper>
        <Column footer={footer}>
          <div className={styles.content}>
            <h6 className={styles.heading}>History:</h6>
            <ul className={styles.list}>
              {archives.map(archive =>
                <File
                  archive={archive}
                  key={archive.id}
                  onClick={() => this.props.onClick(archive.id)}
                  onUnlockClick={() => this.props.onUnlockClick(archive.id)}
                  onRemoveClick={() => this.props.onRemoveClick(archive.id)}
                />
              )}
            </ul>
          </div>
        </Column>
      </Wrapper>
    );
  }
}

export default RecentFiles;
