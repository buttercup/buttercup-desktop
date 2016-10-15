import React, { Component, PropTypes } from 'react';

class TreeLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    if (this._input) {
      this._input.focus();
      this._input.select();
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
      onRemoveClick(id);
    }
  }

  render() {
    const { title, id } = this.props;
    const { onAddClick, onRemoveClick } = this.props;
    
    const editMode = title.toLowerCase() === 'untitled';
    const titleLabel = editMode ? (
      <input
        value={this.state.title}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        ref={c => {
          this._input = c;
        }}
        />
      ) : title;

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
