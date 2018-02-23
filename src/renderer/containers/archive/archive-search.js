import { connect } from 'react-redux';
import ArchiveSearch from '../../components/archive/archive-search';
import { selectEntry } from '../../../shared/actions/entries';
import { loadGroup } from '../../../shared/actions/groups';
import { getArchive } from '../../../shared/buttercup/archive';
import { getCurrentArchive } from '../../../shared/selectors';
import { loadOrUnlockArchive } from '../../../shared/actions/archives';

export default connect(
  state => ({
    currentArchive: getCurrentArchive(state),
    getArchive
  }),
  {
    onSelectEntry: selectEntry,
    switchArchive: loadOrUnlockArchive,
    onGroupSelect: loadGroup
  }
)(ArchiveSearch, 'ArchiveSearch');
