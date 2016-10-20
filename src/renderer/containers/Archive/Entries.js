import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import { getCurrentEntries } from '../../redux/modules/entries';

export default connect(
  state => ({
    entries: getCurrentEntries(state.entries)
  }),
  null
)(Entries, 'Entries');
