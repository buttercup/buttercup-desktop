import React, { Component, PropTypes } from 'react';
import zxcvbn from 'zxcvbn';
import cx from 'classnames';
import WarningIcon from 'react-icons/lib/md/warning';
import InfoIcon from 'react-icons/lib/md/info';
import styles from '../styles/meter';

class Meter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: true
    };
  }

  render() {
    const result = zxcvbn(this.props.input); 
    return (
      <div onClick={() => this.setState({details: !this.state.details})}>
        <div className={styles.barWrapper}>
          <div
            className={cx(styles.barContent, styles[`level${result.score}`])}
            style={{
              right: `${100 - (result.score * 25)}%`
            }}
            />
        </div>
        <div 
          className={styles.suggestions} 
          style={{
            display: (this.state.details && (result.feedback.warning || result.feedback.suggestions.length > 0)) ? 
              'block' : 'none'
          }}
          >
        {result.feedback.warning && <p><WarningIcon/> {result.feedback.warning}</p>}
        {result.feedback.suggestions.length > 0 && <p><InfoIcon/> {result.feedback.suggestions.join(' ')}</p>}
        </div>
      </div>
    );
  }
}

Meter.propTypes = {
  input: PropTypes.string
};

export default Meter;
