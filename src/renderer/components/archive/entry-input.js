import React, { Component, PropTypes } from 'react';
import zxcvbn from 'zxcvbn';
import cx from 'classnames';
import styles from '../../styles/entry-input';

const BareInput = ({input, name, placeholder, meta}) => {
  const isPassword = /password/.test(name);
  return (
    <input
      {...input}
      id={name}
      type={isPassword && !meta.active ? 'password' : 'text'}
      placeholder={placeholder}
      className={styles.input}
      />
    );
};

BareInput.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object
};

const Informer = ({input}) => {
  const result = zxcvbn(input); 
  return (
    <div className={styles.barWrapper}>
      <div
        className={cx(styles.barContent, styles[`level${result.score}`])}
        style={{
          right: `${100 - (result.score * 25)}%`
        }}
        />
    </div>
  );
};

Informer.propTypes = {
  input: PropTypes.string
};

class Input extends Component {
  render() {
    const { type, input } = this.props;
    return (
      <div className={styles.wrapper}>
        <BareInput {...this.props}/>
        {type === 'password' && <Informer input={input.value}/>}
      </div>
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  input: PropTypes.object
};

export default Input;
