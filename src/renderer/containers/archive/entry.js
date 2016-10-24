import { connect } from 'react-redux';
import Entry from '../../components/archive/entry';
import { getCurrentEntry, updateEntry, deleteEntry } from '../../redux/modules/entries';

export default connect(
  state => ({
    entry: getCurrentEntry(state.entries)
  }),
  {
    onSave: updateEntry,
    onDelete: deleteEntry
  }
)(Entry, 'Entry');
