import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryIcon from 'react-icons/lib/go/history';
import { Button } from '@buttercup/ui';
import styled from 'styled-components';
import { brands } from '../../shared/buttercup/brands';
import { showContextMenu } from '../system/menu';
import EmptyView from './empty-view';
import Column from './column';

const Wrapper = styled.div`
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--sidebar-bg);
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

  figure {
    margin: 0;
    padding: 0;
    flex: 0 0 2rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      display: block;
    }
  }

  .status {
    font-weight: 300;
    font-size: .75em;
    color: ${props => props.locked ? 'var(--red)' : 'var(--gray-dark)'};
    text-transform: uppercase;
    display: block;
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

const File = ({ archive, onClick, onRemoveClick, active, index }) => {
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
      <figure>
        <img src={brands[archive.type].icon} />
      </figure>
      <section>
        <div>{name}</div>
        <span className='status'>{archive.status}</span>
      </section>
    </FileItem>
  );
};

File.propTypes = {
  archive: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

class RecentFiles extends Component {
  static propTypes = {
    archives: PropTypes.array,
    currentArchiveId: PropTypes.string,
    onRemoveClick: PropTypes.func,
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
      <div>
        <EmptyView caption="No archives yet." />
      </div>
    );
  }

  render() {
    const { archives, currentArchiveId } = this.props;

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
          <ArchiveList>
            {archives.map((archive, i) =>
              <File
                active={archive.id === currentArchiveId}
                archive={archive}
                key={archive.id}
                index={i}
                onClick={() => this.props.onClick(archive.id)}
                onRemoveClick={() => this.props.onRemoveClick(archive.id)}
              />
            )}
          </ArchiveList>
        </Column>
      </Wrapper>
    );
  }
}

export default RecentFiles;
