import { connect } from 'react-redux';
import { initialize, isDirty } from 'redux-form';
import Entry from '../../components/archive/entry';
import { getCurrentEntry } from '../../../shared/selectors';
import {
  updateEntry,
  newEntry,
  deleteEntry,
  changeMode
} from '../../../shared/actions/entries';

export default connect(
  state => ({
    entry: getCurrentEntry(state),
    mode: state.entries.mode,
    dirty: isDirty('editForm')(state)
  }),
  {
    onEditEntry: updateEntry,
    onNewEntry: newEntry,
    onDelete: deleteEntry,
    handleEditMode: changeMode('edit'),
    handleViewMode: changeMode('view'),
    initializeForm: entry => initialize('editForm', entry)
  }
)(Entry, 'Entry');
