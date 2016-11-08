import { reduxForm } from 'redux-form';
import EntryForm from '../../components/archive/entry-form';

export default reduxForm({
  form: 'editForm'
})(EntryForm);
