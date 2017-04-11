import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getGroups, getCurrentEntry, getEntries } from '../../../shared/selectors';
import * as entries from '../../../shared/actions/entries';

export default connect(
  state => ({
    groups: getGroups(state),
    filter: state.entries.filter,
    sortMode: state.entries.sortMode,
    entries: getEntries(state),
    currentEntry: getCurrentEntry(state),
    currentGroup: state.groups.currentGroup
  }),
  {
    onSelectEntry: entries.selectEntry,
    onEntryMove: entries.moveEntry,
    onFilterChange: entries.setFilter,
    onSortModeChange: entries.setSortMode,
    onDelete: entries.deleteEntry,
    handleAddEntry: entries.changeMode('new')
  }
)(Entries, 'Entries');
