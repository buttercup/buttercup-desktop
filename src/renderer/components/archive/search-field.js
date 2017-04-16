import React, { Component, PropTypes } from 'react';
import SearchIcon from 'react-icons/lib/md/search';
import styles from '../../styles/search-field';

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleClearClick() {
    if (this.textInput) {
      this.textInput.value = '';
      this.props.onChange('');
    }
  }

  handleKeyUp(e) {
    if (e.which === 27) {
      this.handleClearClick();
      e.target.blur();
    }
  }

  render() {
    const { filter, onChange } = this.props;
    return (
      <div className={styles.wrapper}>
        <input
          type="text"
          value={filter}
          onChange={e => onChange(e.target.value)}
          onKeyUp={e => this.handleKeyUp(e)}
          className={styles.field}
          placeholder="Search..."
          ref={input => {
            this.textInput = input;
          }}
          />
        <span className={styles.icon}>
          <SearchIcon />
        </span>
        {this.state.value !== '' && <span className={styles.clear} onClick={() => this.handleClearClick()} />}
      </div>
    );
  }
}

SearchField.propTypes = {
  onChange: PropTypes.func,
  filter: PropTypes.string
};

export default SearchField;
