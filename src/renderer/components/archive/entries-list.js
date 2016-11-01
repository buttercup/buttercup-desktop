import React, { PropTypes } from 'react';
import { style, merge, $ } from 'glamor';
import { spacing, colors } from '../styles/variables';

const List = ({entries, currentEntry, onSelectEntry, onRightClick}) => (
  <ul className={styles.list}>
    {entries.map(entry => 
      <li
        key={entry.id}
        className={merge(
          styles.item,
          (currentEntry && entry.id === currentEntry.id) && styles.activeItem
        )}
        onClick={() => onSelectEntry(entry.id)}
        onContextMenu={() => onRightClick(entry)}
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
  onSelectEntry: PropTypes.func,
  onRightClick: PropTypes.func
};

const styles = {
  list: style({
    listStyle: 'none',
    margin: 0,
    padding: 0
  }),
  item: merge(
    style({
      padding: `${spacing.HALF} ${spacing.ONE}`,
      cursor: 'pointer !important',
      transition: 'background-color ease .2s',
      ':hover': {
        backgroundColor: colors.BLACK_20
      }
    }),
    $(' strong, small', {
      display: 'block',
      fontWeight: 'normal',
      cursor: 'inherit'
    }),
    $(' small', {
      opacity: 0.5,
      cursor: 'inherit'
    })
  ),
  activeItem: style({
    backgroundColor: `${colors.BRAND_PRIMARY} !important`
  })
};

export default List;
