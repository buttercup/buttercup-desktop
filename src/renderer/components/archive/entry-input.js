import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Meter from '../meter';
import Generator from '../generator';
import styles from '../../styles/entry-input';

const BareInput = ({input, name, placeholder, type}) => {
  const isPassword = type === 'password';
  return (
    <input
      {...input}
      id={name}
      type="text"
      placeholder={placeholder}
      className={cx(styles.input, isPassword ? styles.password : null)}
      />
    );
};

BareInput.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  type: PropTypes.string
};

class Input extends Component {

  receivePassword(newPassword) {
    const { input: { onChange } } = this.props;
    onChange(newPassword);
  }

  render() {
    const { type, input } = this.props;
    return (
      <div className={styles.wrapper}>
        <BareInput {...this.props}/>
        {type === 'password' && 
          <Generator
            onGenerate={pwd => this.receivePassword(pwd)}
            className={styles.generator}
            activeClassName={styles.generatorActive}
            />}
        {type === 'password' && <Meter input={input.value}/>}
      </div>
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  input: PropTypes.object
};

export default Input;
