import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getCurrentEntries, selectEntry, getCurrentEntry, changeMode, setFilter } from '../../redux/modules/entries';

export default connect(
  state => ({
    filter: state.entries.filter,
    entries: getCurrentEntries(state.entries),
    currentEntry: getCurrentEntry(state.entries),
    currentGroup: state.groups.currentGroup
  }),
  {
    onSelectEntry: selectEntry,
    onFilterChange: setFilter,
    handleAddEntry: changeMode('new')
  }
)(Entries, 'Entries');
