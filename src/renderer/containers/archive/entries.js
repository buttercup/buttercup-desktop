import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getCurrentEntries, selectEntry, getCurrentEntry, changeMode } from '../../redux/modules/entries';

export default connect(
  state => ({
    entries: getCurrentEntries(state.entries),
    currentEntry: getCurrentEntry(state.entries),
    currentGroup: state.groups.currentGroup
  }),
  {
    onSelectEntry: selectEntry,
    handleAddEntry: changeMode('new')
  }
)(Entries, 'Entries');
