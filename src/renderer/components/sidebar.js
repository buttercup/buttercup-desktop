import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ArchiveIcon from 'react-icons/lib/md/add';
import LockOpen from 'react-icons/lib/md/lock-open';
import LockClosed from 'react-icons/lib/md/lock-outline';
import { Button } from '@buttercup/ui';
import styled from 'styled-components';
import { brands } from '../../shared/buttercup/brands';
import { isOSX } from '../../shared/utils/platform';
import { showContextMenu } from '../system/menu';
import EmptyView from './empty-view';
import Avatar from './avatar';
import BaseColumn from './column';

const Column = styled(BaseColumn)`
  width: ${props => props.condenced ? 'var(--sidebar-width-condenced)' : 'var(--sidebar-width)'};
  height: 100%;
  background-color: ${isOSX() ? 'transparent' : 'var(--sidebar-bg)'};
  display: flex;
`;

const ArchiveList = styled.ul`
  margin: calc(var(--spacing-one) * 3) 0 0 0;
  padding: 0;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  color: #fff;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, .1)' : 'transparent'};
  padding: var(--spacing-half) var(--spacing-one);
  cursor: ${props => props.locked ? 'pointer' : 'default'} !important;

  &:active {
    background-color: rgba(255, 255, 255, .2);
  }

  figure {
    margin: 0;
    padding: 0;
    flex: 0 0 3rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      display: block;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, .2);
    }
  }

  .status {
    font-weight: 300;
    font-size: .75em;
    color: ${props => props.locked ? 'var(--red)' : 'var(--gray-dark)'};
    text-transform: uppercase;
    display: block;

    svg {
      vertical-align: -2px !important;
      margin-right: 3px;
      height: 12px;
      width: 12px;
    }
  }

  section {
    font-size: .9em;
    flex: 1;
    min-width: 0;
    padding-left: var(--spacing-one);

    div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const File = ({ archive, onClick, onRemoveClick, onArchiveUpdate, active, index, condenced }) => {
  // const { base, dir } = parsePath(archive.path);
  const { name } = archive;
  return (
    <FileItem
      active={active}
      locked={archive.status === 'locked'}
      onClick={
        active
          ? null
          : onClick
      }
      onContextMenu={e => {
        e.stopPropagation();
        showContextMenu([{
          label: `${archive.status === 'locked' ? 'Unlock' : 'Open'} ${name}`,
          accelerator: `CmdOrCtrl+${index + 1}`,
          click: onClick
        }, {
          label: `Remove ${name}`,
          click: onRemoveClick
        }]);
      }}
      >
      {/*<figure>
        <img src={brands[archive.type].icon} />
      </figure>*/}
      <Avatar archive={archive} onUpdate={onArchiveUpdate} />
      {!condenced && <section>
        <div>{name}</div>
        <span className='status'>
          {archive.status === 'locked' ? <LockClosed /> : <LockOpen />}
          {archive.status}
        </span>
      </section>}
    </FileItem>
  );
};

File.propTypes = {
  archive: PropTypes.object,
  active: PropTypes.bool,
  condenced: PropTypes.bool,
  index: PropTypes.number,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  onArchiveUpdate: PropTypes.func
};

class RecentFiles extends Component {
  static propTypes = {
    condenced: PropTypes.bool,
    archives: PropTypes.array,
    currentArchiveId: PropTypes.string,
    onRemoveClick: PropTypes.func,
    onOpenClick: PropTypes.func,
    onNewClick: PropTypes.func,
    onCloudClick: PropTypes.func,
    onArchiveUpdate: PropTypes.func,
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
      <div>
        <EmptyView caption="No archives yet." />
      </div>
    );
  }

  render() {
    const { archives, currentArchiveId, condenced } = this.props;

    // if (archives.length === 0) {
    //   return this.renderEmptyState();
    // }

    const footer = (
      <Button
        dark
        full
        onClick={this.showCreateMenu}
        icon={<ArchiveIcon />}
        >
        {condenced ? ' ' : 'Add Archive'}
      </Button>
    );

    return (
      <Column footer={footer} condenced={condenced}>
        <ArchiveList>
          {archives.map((archive, i) =>
            <File
              active={archive.id === currentArchiveId}
              archive={archive}
              key={archive.id}
              index={i}
              condenced={condenced}
              onArchiveUpdate={this.props.onArchiveUpdate}
              onClick={() => this.props.onClick(archive.id)}
              onRemoveClick={() => this.props.onRemoveClick(archive.id)}
            />
          )}
        </ArchiveList>
      </Column>
    );
  }
}

export default RecentFiles;
