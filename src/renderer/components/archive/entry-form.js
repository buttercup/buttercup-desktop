import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';

class EntryForm extends Component {
  render() {
    const { handleSubmit, dirty } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="properties.title">Title</label>
          <Field name="properties.title" component="input" type="text"/>
        </div>
        <div>
          <label htmlFor="properties.username">Username</label>
          <Field name="properties.username" component="input" type="text"/>
        </div>
        <div>
          <label htmlFor="properties.password">Password</label>
          <Field name="properties.password" component="input" type="password"/>
        </div>
        {dirty && <button type="submit">Submit</button>}
      </form>
    );
  }
}

EntryForm.propTypes = {
  entry: PropTypes.object,
  dirty: PropTypes.bool,
  handleSubmit: PropTypes.func
};

export default EntryForm;
