import React, { Component, PropTypes } from 'react';

class TreeLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    if (this._input) {
      this._input.focus();
      this._input.select();
    }
  }

  handleBlur(e) {
    const { onRemoveClick, id } = this.props;
    if (this.state.title.toLowerCase() === 'untitled') {
      onRemoveClick(e, id);
    }
  }

  handleChange(e) {
    this.setState({title: e.target.value});
  }

  handleKeyUp(e) {
    const { onSaveClick, onRemoveClick, id } = this.props;
    if (e.keyCode === 13) {
      onSaveClick(id, this.state.title);
    } else if (e.keyCode === 27) {
      onRemoveClick(e, id);
    }
  }

  render() {
    const { title, id, isTrash } = this.props;
    const { onAddClick, onRemoveClick } = this.props;
    
    const editMode = title.toLowerCase() === 'untitled';
    const titleLabel = editMode ? (
      <input
        value={this.state.title}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        onBlur={this.handleBlur}
        ref={c => {
          this._input = c;
        }}
        />
      ) : title;

      /*{!isTrash && <button onClick={e => onRemoveClick(e, id)}>&times;</button>}
        {(editMode || isTrash) ? null : <button onClick={e => onAddClick(e, id)}>+</button>}*/

    return (
      <span>
        {titleLabel}
        
      </span>
    );
  }  
}

TreeLabel.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  isTrash: PropTypes.bool,
  onAddClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  onSaveClick: PropTypes.func
};

export default TreeLabel;
