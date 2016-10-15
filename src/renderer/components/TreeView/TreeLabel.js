import React, { Component, PropTypes } from 'react';

class TreeLabel extends Component {
  render() {
    const { title, id } = this.props;
    const { onAddClick, onRemoveClick } = this.props;
    return (
      <span>
        {title}
        <button onClick={() => onRemoveClick(id)}>&times;</button>
        <button onClick={() => onAddClick(id)}>+</button>
      </span>
    );
  }  
}

TreeLabel.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  onAddClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

export default TreeLabel;
