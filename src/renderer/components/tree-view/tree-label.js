import React, { Component, PropTypes } from 'react';
import { style, merge } from 'glamor';
import { colors } from '../styles/variables';

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
    const { title, onRightClick } = this.props;
    
    const editMode = title.toLowerCase() === 'untitled';
    const titleLabel = editMode ? (
      <input
        className={merge(styles.node, styles.input)}
        value={this.state.title}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        onBlur={this.handleBlur}
        ref={c => {
          this._input = c;
        }}
        />
      ) : title;

    /* {!isTrash && <button onClick={e => onRemoveClick(e, id)}>&times;</button>}
      {(editMode || isTrash) ? null : <button onClick={e => onAddClick(e, id)}>+</button>} */

    return (
      <span onContextMenu={() => onRightClick()} className={styles.node}>
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
  onSaveClick: PropTypes.func,
  onRightClick: PropTypes.func
};

const styles = {
  node: style({
    display: 'block',
    width: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }),

  input: style({
    border: 'none',
    outline: 'none',
    borderRadius: '2px',
    backgroundColor: colors.DARK_SECONDARY,
    boxSizing: 'border-box'
  })
};

export default TreeLabel;
