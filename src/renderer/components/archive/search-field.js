import React, { Component, PropTypes } from 'react';
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
      this.handleChange('');
    }
  }

  handleChange(value) {
    this.setState({value});
    this.props.onChange(value);
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <input
          type="text"
          onChange={e => this.handleChange(e.target.value)}
          className={styles.field}
          placeholder="Search..."
          ref={input => {
            this.textInput = input;
          }}
          />
        {this.state.value !== '' && <span className={styles.clear} onClick={() => this.handleClearClick()}></span>}
      </div>
    );
  }
}

SearchField.propTypes = {
  onChange: PropTypes.func
};

export default SearchField;
