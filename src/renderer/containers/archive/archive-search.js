import { connect } from 'react-redux';
import ArchiveSearch from '../../components/archive/archive-search';
import { getArchive } from '../../../shared/buttercup/archive';
import { getCurrentArchive } from '../../../shared/selectors';
import { setIsArchiveSearchVisible } from '../../../shared/actions/ui-state';

import { selectArchiveGroupAndEntry } from '../../../shared/actions/entries';

export default connect(
  state => ({
    currentArchive: getCurrentArchive(state),
    getArchive
  }),
  {
    selectArchiveGroupAndEntry,
    setIsArchiveSearchVisible
  }
)(ArchiveSearch, 'ArchiveSearch');
