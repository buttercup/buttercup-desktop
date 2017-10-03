import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';
import { Generator, Meter } from '@buttercup/ui';
import MagicIcon from 'react-icons/lib/fa/magic';
import styles from '../../styles/entry-input';

const BareInput = ({ input, name, placeholder, type }) => {
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
  type: PropTypes.string
};

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    input: PropTypes.object
  };

  state = {
    isGeneratorOpen: false
  };

  handleGeneratorToggle() {
    this.setState({
      isGeneratorOpen: !this.state.isGeneratorOpen
    });
  }

  receivePassword(newPassword) {
    const { input: { onChange } } = this.props;
    onChange(newPassword);
    this.handleGeneratorToggle();
  }

  render() {
    const { type, input } = this.props;
    return (
      <div className={styles.wrapper}>
        <BareInput {...this.props} />
        {type === 'password' && (
          <Generator
            onGenerate={pwd => this.receivePassword(pwd)}
            isOpen={this.state.isGeneratorOpen}
            preferPlace="below"
          >
            <div
              className={cx(
                styles.generator,
                this.state.isGeneratorOpen && styles.generatorActive
              )}
            >
              <MagicIcon onClick={() => this.handleGeneratorToggle()} />
            </div>
          </Generator>
        )}
        {type === 'password' && <Meter input={input.value} />}
      </div>
    );
  }
}
