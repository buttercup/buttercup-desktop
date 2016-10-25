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
  onCancelClick(e) {
    e.preventDefault();
    this.props.onCancel();
  }
  
  onDeleteClick(e) {
    e.preventDefault();
    this.props.onDelete();
  }

  render() {
    const { handleSubmit, dirty, onDelete } = this.props;
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
        <button onClick={e => this.onCancelClick(e)}>Cancel</button>
        {onDelete && <button onClick={e => this.onDeleteClick(e)}>Delete</button>}
      </form>
    );
  }
}

EntryForm.propTypes = {
  entry: PropTypes.object,
  dirty: PropTypes.bool,
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
};

export default EntryForm;
