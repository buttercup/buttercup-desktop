import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { Generator, Meter, Input as BaseInput } from '@buttercup/ui';
import MagicIcon from 'react-icons/lib/fa/magic';
import styles from '../../styles/entry-input';

export const Wrapper = styled.div`
  flex: 1;
  min-height: $form-input-height;
  margin-right: $spacing-half;
  position: relative;
`;

const PasswordInput = styled(BaseInput)`
  padding-right: 2.2rem;
  font-size: 14px;
  font-family: Anonymous;
`;

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object
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
    const { type, input, placeholder, meta } = this.props;
    return (
      <Wrapper>
        <Choose>
          <When condition={type === 'password'}>
            <PasswordInput
              {...input}
              id={name}
              type={
                meta.active || this.state.isGeneratorOpen ? 'text' : 'password'
              }
              placeholder={placeholder}
            />
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
            <Meter input={input.value} />
          </When>
          <Otherwise>
            <BaseInput
              {...input}
              id={name}
              type="text"
              placeholder={placeholder}
            />
          </Otherwise>
        </Choose>
      </Wrapper>
    );
  }
}
