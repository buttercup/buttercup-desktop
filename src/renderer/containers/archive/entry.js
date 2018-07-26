import { connect } from 'react-redux';
import { initialize, isDirty } from 'redux-form';
import {
  changeMode,
  deleteEntry,
  newEntry,
  updateEntry
} from '../../../shared/actions/entries';
import {
  createNewEntryStructure,
  prepareEntryForEditing
} from '../../../shared/buttercup/entries.js';
import { getCurrentEntry } from '../../../shared/selectors';
import Entry from '../../components/archive/entry';

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
    initializeForm: (entry, mode) =>
      initialize(
        'editForm',
        mode === 'new'
          ? prepareEntryForEditing(createNewEntryStructure())
          : prepareEntryForEditing(entry)
      )
  }
)(Entry, 'Entry');
