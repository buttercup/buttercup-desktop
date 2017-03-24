import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getGroups } from '../../../shared/reducers/groups';
import { getCurrentEntries, getCurrentEntry } from '../../../shared/reducers/entries';
import * as entries from '../../../shared/actions/entries';

export default connect(
  state => ({
    groups: getGroups(state.groups),
    filter: state.entries.filter,
    sortMode: state.entries.sortMode,
    entries: getCurrentEntries(state.entries),
    currentEntry: getCurrentEntry(state.entries),
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
