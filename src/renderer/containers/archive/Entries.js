import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getCurrentEntries, selectEntry, getCurrentEntry } from '../../redux/modules/entries';

export default connect(
  state => ({
    entries: getCurrentEntries(state.entries),
    currentEntry: getCurrentEntry(state.entries)
  }),
  {
    onSelectEntry: selectEntry
  }
)(Entries, 'Entries');
