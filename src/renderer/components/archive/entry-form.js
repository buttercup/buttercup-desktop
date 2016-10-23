import React, { Component, PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';

const renderMeta = ({fields, meta: {touched, error}}) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Meta</button>
      {touched && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) => 
      <li key={index}>
        <Field
          name={`${member}.key`}
          type="text"
          component="input"
          placeholder="Key"
          />
        <Field
          name={`${member}.value`}
          type="text"
          component="input"
          placeholder="Value"
          />
        <button onClick={() => fields.remove(index)}>&times;</button>
      </li>
    )}
  </ul>
);

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
        <FieldArray name="meta" component={renderMeta}/>
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
