import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../styles/entries-list';

const List = ({ entries, currentEntry, onSelectEntry, onRightClick }) => (
  <ul className={styles.list}>
    {entries.map(entry => (
      <li
        key={entry.id}
        className={
          currentEntry && entry.id === currentEntry.id && styles.active
        }
        onClick={() => onSelectEntry(entry.id)}
        onContextMenu={() => onRightClick(entry)}
      >
        <strong>{entry.properties.title}</strong>
        <small>{entry.properties.username}</small>
      </li>
    ))}
  </ul>
);

List.propTypes = {
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  onSelectEntry: PropTypes.func,
  onRightClick: PropTypes.func
};

export default List;
