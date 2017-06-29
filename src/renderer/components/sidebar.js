import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryIcon from 'react-icons/lib/go/history';
import { Button } from '@buttercup/ui';
import styled from 'styled-components';
import { brands } from '../../shared/buttercup/brands';
import styles from '../styles/recent-files';
import { parsePath } from '../system/utils';
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
    onClearClick: PropTypes.func,
    onClick: PropTypes.func
  };

  showContextMenu = () => {
    showContextMenu([
      {
        label: 'Clear History',
        click: this.props.onClearClick
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
      <Button dark full onClick={() => this.props.onClearClick()} icon={<HistoryIcon />}>Clear History</Button>
    );

    return (
      <Wrapper>
        <Column footer={footer} onContextMenu={this.showContextMenu}>
          <div className={styles.content}>
            <h6 className={styles.heading}>History:</h6>
            <ul className={styles.list}>
              {archives.map(archive =>
                <File
                  archive={archive}
                  key={archive.id}
                  onClick={() => this.props.onClick(archive)}
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
