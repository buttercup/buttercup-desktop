import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../styles/entries-list';
import EntryIcon from './entry-icon';

const List = ({ entries, currentEntry, onSelectEntry, onRightClick }) => (
  <ul className={styles.list}>
    {entries.map(entry => (
      <li
        key={entry.id}
        className={
          currentEntry && entry.id === currentEntry.id ? styles.active : null
        }
        onClick={() => onSelectEntry(entry.id)}
        onContextMenu={() => onRightClick(entry)}
      >
        <div className={styles.icon}>
          <EntryIcon icon={entry.icon} />
        </div>
        <div className={styles.text}>
          <strong>{entry.properties.title}</strong>
          <small>{entry.properties.username}</small>
        </div>
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
