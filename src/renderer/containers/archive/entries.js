import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getGroups } from '../../redux/modules/groups';
import * as entries from '../../redux/modules/entries';

export default connect(
  state => ({
    groups: getGroups(state.groups),
    filter: state.entries.filter,
    sortMode: state.entries.sortMode,
    entries: entries.getCurrentEntries(state.entries),
    currentEntry: entries.getCurrentEntry(state.entries),
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
