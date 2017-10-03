import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { isOSX, isHighSierra } from '../../shared/utils/platform';
import AddArchiveButton from '../containers/add-archive-button';
import EmptyView from './empty-view';
import BaseColumn from './column';
import SidebarItem from './sidebar-item';

// Temporary fix for High Sierra. See #339
const usesBigPadding = isOSX() && !isHighSierra();

const Column = styled(BaseColumn)`
  width: ${props =>
    props.condenced
      ? 'var(--sidebar-width-condenced)'
      : 'var(--sidebar-width)'};
  height: 100%;
  background-color: ${isOSX() ? 'transparent' : 'var(--sidebar-bg)'};
  display: flex;
`;

const ArchiveList = styled.ul`
  margin: ${usesBigPadding
      ? 'calc(var(--spacing-one) * 3)'
      : 'var(--spacing-one)'}
    0 0 0;
  padding: 0;
`;

class RecentFiles extends Component {
  static propTypes = {
    condenced: PropTypes.bool,
    archives: PropTypes.array,
    currentArchiveId: PropTypes.string,
    onRemoveClick: PropTypes.func,
    onArchiveUpdate: PropTypes.func,
    onClick: PropTypes.func,
    showImportDialog: PropTypes.func
  };

  renderEmptyState() {
    return (
      <div>
        <EmptyView caption="No archives yet." />
      </div>
    );
  }

  render() {
    const { archives, currentArchiveId, condenced } = this.props;

    const footer = <AddArchiveButton dark full condenced={condenced} />;

    return (
      <Column footer={footer} condenced={condenced}>
        <ArchiveList>
          {archives.map((archive, i) => (
            <SidebarItem
              active={archive.id === currentArchiveId}
              archive={archive}
              key={archive.id}
              index={i}
              condenced={condenced}
              onArchiveUpdate={this.props.onArchiveUpdate}
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
