import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import EntryIcon from './entry-icon';
import { getFacadeFieldValue } from '../../../shared/buttercup/entries';

const ListItemContentWrapper = styled.div`
  padding-bottom: 2px;
  margin-left: 15px;
  flex: 1;

  strong,
  small {
    display: block;
    font-weight: normal;
    cursor: inherit;
  }

  small {
    font-weight: 300;
    opacity: 0.7;
  }
`;

const ListWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  padding: var(--spacing-half) var(--spacing-one);
  cursor: pointer !important;
  transition: background-color ease 0.2s;
  display: flex;
  align-items: center;
  background-color: ${props =>
    props.active ? 'var(--brand-primary)' : 'transparent'};

  &:hover {
    background-color: ${props =>
      props.active ? 'var(--brand-primary)' : 'var(--black-20)'};
  }
`;

const ListItemContent = ({ entry }) => (
  <ListItemContentWrapper>
    <strong>{getFacadeFieldValue(entry, 'title')}</strong>
    <small>{getFacadeFieldValue(entry, 'username')}</small>
  </ListItemContentWrapper>
);

ListItemContent.propTypes = {
  entry: PropTypes.object
};

const List = ({ entries, currentEntry, onSelectEntry, onRightClick }) => (
  <ListWrapper>
    <For each="entry" of={entries}>
      <ListItem
        key={entry.id}
        active={currentEntry && entry.id === currentEntry.id}
        onClick={() => onSelectEntry(entry.id)}
        onContextMenu={() => onRightClick(entry)}
      >
        <EntryIcon entry={entry} />
        <ListItemContent entry={entry} />
      </ListItem>
    </For>
  </ListWrapper>
);

List.propTypes = {
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  onSelectEntry: PropTypes.func,
  onRightClick: PropTypes.func
};

export default List;
