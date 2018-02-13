import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SortableContainer } from 'react-sortable-hoc';
import { isOSX } from '../../shared/utils/platform';
import AddArchiveButton from '../containers/add-archive-button';
import BaseColumn from './column';
import SidebarItem from './sidebar-item';

const Column = styled(BaseColumn)`
  width: ${props =>
    props.condenced
      ? 'var(--sidebar-width-condenced)'
      : 'var(--sidebar-width)'};
  height: 100%;
  background-color: ${isOSX() ? 'transparent' : 'var(--sidebar-bg)'};
  display: flex;
`;

const ArchiveList = SortableContainer(styled.ul`
  -webkit-app-region: no-drag;
  margin: calc(var(--spacing-one) * ${isOSX() ? 3 : 1}) 0 0 0;
  padding: 0;
`);

class RecentFiles extends PureComponent {
  static propTypes = {
    condenced: PropTypes.bool.isRequired,
    archives: PropTypes.array.isRequired,
    currentArchiveId: PropTypes.string,
    onRemoveClick: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onLockArchive: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired,
    onChangeColour: PropTypes.func.isRequired,
    onChangeOrder: PropTypes.func.isRequired,
    showImportDialog: PropTypes.func.isRequired
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const archive = this.props.archives[oldIndex];
    this.props.onChangeOrder({
      archiveId: archive.id,
      order: newIndex
    });
  };

  render() {
    const { archives, currentArchiveId, condenced } = this.props;

    const footer = <AddArchiveButton dark full condenced={condenced} />;

    return (
      <Column footer={footer} condenced={condenced}>
        <ArchiveList
          onSortEnd={this.onSortEnd}
          distance={5}
          lockAxis="y"
          lockToContainerEdges
        >
          {archives.map((archive, i) => (
            <SidebarItem
              active={archive.id === currentArchiveId}
              archive={archive}
              key={archive.id}
              index={i}
              order={i}
              condenced={condenced}
              onLockArchive={() => this.props.onLockArchive(archive.id)}
              onChangePassword={() => this.props.onChangePassword(archive.id)}
              onChangeColour={this.props.onChangeColour}
              onClick={() => this.props.onClick(archive.id)}
              onRemoveClick={() => this.props.onRemoveClick(archive.id)}
              showImportDialog={this.props.showImportDialog}
            />
          ))}
        </ArchiveList>
      </Column>
    );
  }
}

export default RecentFiles;
