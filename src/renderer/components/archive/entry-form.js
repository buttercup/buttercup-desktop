import React, { Component, PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';
import PlusIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/fa/trash-o';
import { formRow, formInput, metaWrapper, heading } from '../styles';
import Button from '../button';

const Input = field => (
  <div className="input-wrapper">
    <input {...field.input} id={field.name} type={field.type} placeholder={field.placeholder} className={formInput}/>
  </div>
);

const renderMeta = ({fields, meta: {touched, error}}) => ( // eslint-disable-line react/prop-types
  <div>
    <div className={metaWrapper}>
      {fields.map((member, index) => 
        <div className={formRow} key={index}>
          <div className="label-wrapper">
            <Field
              name={`${member}.key`}
              type="text"
              component="input"
              placeholder="Label"
              />
          </div>
          <Field
            name={`${member}.value`}
            type="text"
            component={Input}
            placeholder="New Field"
            />
          <Button
            onClick={e => {
              e.preventDefault();
              fields.remove(index);
            }}
            icon={<RemoveIcon/>}
            />
        </div>
      )}
    </div>
    <Button onClick={() => fields.push({})} icon={<PlusIcon/>}>Add New Field</Button>
    {touched && error && <span>{error}</span>}
  </div>
);

class EntryForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={formRow}>
          <label className="label-wrapper" htmlFor="properties.title">Title</label>
          <Field name="properties.title" component={Input} type="text" placeholder="Untitled"/>
        </div>
        <div className={formRow}>
          <label className="label-wrapper" htmlFor="properties.username">Username</label>
          <Field name="properties.username" component={Input} type="text" placeholder="@username..."/>
        </div>
        <div className={formRow}>
          <label className="label-wrapper" htmlFor="properties.password">Password</label>
          <Field name="properties.password" component={Input} type="password" placeholder="Secure password..."/>
        </div>
        <h6 className={heading}>Custom Fields:</h6>
        <FieldArray name="meta" component={renderMeta}/>
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
