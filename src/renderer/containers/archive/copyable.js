import { connect } from 'react-redux';
import Copyable from '../../components/archive/copyable';
import { getSetting } from '../../../shared/selectors';

export default connect(state => ({
  secondsUntilClearClipboard: getSetting(state, 'secondsUntilClearClipboard')
}))(Copyable, 'Copyable');
