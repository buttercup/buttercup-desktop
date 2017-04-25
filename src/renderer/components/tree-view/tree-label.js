import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from '../../styles/tree-label';

class TreeLabel extends Component {
  state = {
    title: 'Untitled'
  };

  static propTypes = {
    title: PropTypes.string,
    parentId: PropTypes.string,
    isNew: PropTypes.bool,
    onDismissClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onRightClick: PropTypes.func
  };

  handleBlur() {
    this.props.onDismissClick();
  }

  handleChange(e) {
    this.setState({title: e.target.value});
  }

  handleKeyUp(e) {
    const { onSaveClick, onDismissClick, parentId } = this.props;
    if (e.keyCode === 13) {
      onSaveClick(parentId, this.state.title);
    } else if (e.keyCode === 27) {
      onDismissClick();
    }
  }

  componentDidMount() {
    if (this._input) {
      this._input.focus();
      this._input.select();
    }
  }

  render() {
    const { title, isNew, onRightClick } = this.props;

    return (
      <span onContextMenu={onRightClick} className={styles.node}>
        {isNew ? (
          <input
            className={cx(styles.node, styles.input)}
            value={this.state.title}
            onChange={e => this.handleChange(e)}
            onKeyUp={e => this.handleKeyUp(e)}
            onBlur={e => this.handleBlur(e)}
            ref={c => {
              this._input = c;
            }}
            />
        ) : (title.trim() || <i>Untitled</i>)}
      </span>
    );
  }
}

export default TreeLabel;
