import React, { Component, PropTypes } from 'react';

class TreeLabel extends Component {
  render() {
    const { title, id } = this.props;
    const { onAddClick, onRemoveClick } = this.props;
    
    const editMode = title.toLowerCase() === 'untitled';
    const titleLabel = editMode ? <input value={title}/> : title;

    return (
      <span>
        {titleLabel}
        <button onClick={() => onRemoveClick(id)}>&times;</button>
        {editMode ? null : <button onClick={() => onAddClick(id)}>+</button>}
      </span>
    );
  }  
}

TreeLabel.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  onAddClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  onSaveClick: PropTypes.func
};

export default TreeLabel;
