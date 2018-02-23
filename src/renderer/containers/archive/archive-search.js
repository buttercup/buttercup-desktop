import { connect } from 'react-redux';
import ArchiveSearch from '../../components/archive/archive-search';
import { selectEntry } from '../../../shared/actions/entries.js';
import { loadGroup } from '../../../shared/actions/groups';
import { getArchive } from '../../../shared/buttercup/archive';
import { getCurrentArchive } from '../../../shared/selectors';

export default connect(
  state => ({
    currentArchive: getCurrentArchive(state),
    getArchive
  }),
  {
    onSelectEntry: selectEntry,
    onGroupSelect: loadGroup
  }
)(ArchiveSearch, 'ArchiveSearch');
