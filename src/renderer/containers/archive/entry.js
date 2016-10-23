import { connect } from 'react-redux';
import Entry from '../../components/archive/entry';
import { getCurrentEntry } from '../../redux/modules/entries';

export default connect(
  state => ({
    entry: getCurrentEntry(state.entries)
  }),
  null
)(Entry, 'Entry');
