import { connect } from 'react-redux';
import Entry from '../../components/archive/entry';
import { getCurrentEntry, updateEntry } from '../../redux/modules/entries';

export default connect(
  state => ({
    entry: getCurrentEntry(state.entries)
  }),
  {
    onSave: updateEntry
  }
)(Entry, 'Entry');
