import React, { Component, PropTypes } from 'react';
import { style } from 'glamor';
import { spacing, colors } from '../styles/variables';

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

const styles = {
  wrapper: style({ // eslint-disable-line quote-props
    position: 'relative',
    '::before': {
      display: 'block',
      content: '"⚲"',
      position: 'absolute',
      transform: 'rotate(-45deg)',
      top: '2px',
      left: '4px',
      opacity: 0.5
    }
  }),
  field: style({
    width: '100%',
    backgroundColor: colors.BLACK_25,
    border: 0,
    borderRadius: '5px',
    outline: 'none',
    padding: `${spacing.HALF} ${spacing.TWO}`,
    boxSizing: 'border-box !important',
    fontSize: '.8em',
    ':focus': {
      backgroundColor: colors.BLACK_35
    }
  }),
  clear: style({ // eslint-disable-line quote-props
    width: '12px',
    height: '12px',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '9px',
    right: '7px',
    borderRadius: '50%',
    opacity: 0.5,
    fontSize: '13px',
    textAlign: 'center',
    lineHeight: 1,
    '::before': {
      content: '"×"',
      color: '#000',
      opacity: 0.7
    }
  })
};

export default SearchField;
