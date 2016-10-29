import React, { PropTypes } from 'react';
import { style, merge, $ } from 'glamor';
import { spacing } from '../styles/variables';

const List = ({entries, currentEntry, onSelectEntry}) => (
  <ul className={styles.list}>
    {entries.map(entry => 
      <li
        key={entry.id}
        className={merge(
          styles.item,
          (currentEntry && entry.id === currentEntry.id) && styles.activeItem
        )}
        onClick={() => onSelectEntry(entry.id)}
        >
        <strong>{entry.properties.title}</strong>
        <small>{entry.properties.username}</small>
      </li>
    )}
  </ul>
);

List.propTypes = {
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  onSelectEntry: PropTypes.func
};

const styles = {
  list: style({
    listStyle: 'none',
    margin: 0,
    padding: 0
  }),
  item: merge(
    {
      padding: `${spacing.HALF} ${spacing.ONE}`,
      cursor: 'pointer'
    },
    $(' strong, small', {
      display: 'block',
      fontWeight: 'normal'
    }),
    $(' small', {
      opacity: 0.5
    })
  ),
  activeItem: style({
    backgroundColor: '#00B7AC'
  })
};

export default List;
