import { connect } from 'react-redux';
import Entries from '../../components/archive/entries';
import {
  getGroups,
  getCurrentEntry,
  getEntries,
  getCurrentGroup
} from '../../../shared/selectors';
import * as entries from '../../../shared/actions/entries';

export default connect(
  state => ({
    groups: getGroups(state),
    sortMode: state.entries.sortMode,
    entries: getEntries(state),
    currentEntry: getCurrentEntry(state),
    currentGroup: getCurrentGroup(state)
  }),
  {
    onSelectEntry: entries.selectEntry,
    onEntryMove: entries.moveEntry,
    onSortModeChange: entries.setSortMode,
    onDelete: entries.deleteEntry,
    handleAddEntry: entries.changeMode('new')
  }
)(Entries, 'Entries');
