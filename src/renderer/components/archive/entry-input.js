import React, { Component, PropTypes } from 'react';
import zxcvbn from 'zxcvbn';
import { style } from 'glamor';
import { formInput } from '../styles';
import { colors } from '../styles/variables';

const BareInput = ({input, name, placeholder, meta}) => {
  const isPassword = /password/.test(name);
  return (
    <input
      {...input}
      id={name}
      type={isPassword && !meta.active ? 'password' : 'text'}
      placeholder={placeholder}
      className={formInput}
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
        className={styles.barContent}
        style={{
          backgroundColor: colors[`LEVEL_${result.score}`],
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
      <div className="input-wrapper">
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

const styles = {
  barWrapper: style({
    width: '100%',
    height: '5px',
    borderRadius: '5px',
    position: 'relative',
    marginTop: '5px',
    backgroundColor: colors.GRAY_LIGHT_DARKER
  }),
  barContent: style({
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    borderRadius: '5px',
    background: 'red'
  })
};

export default Input;
