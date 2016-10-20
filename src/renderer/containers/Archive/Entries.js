import { connect } from 'react-redux';
import Entries from '../../components/Archive/Entries';
import { getCurrentEntries } from '../../redux/modules/entries';

export default connect(
  state => ({
    entries: getCurrentEntries(state.entries)
  }),
  null
)(Entries, 'Entries');
