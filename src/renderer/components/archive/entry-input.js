import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Generator, Meter, Input as BaseInput } from '@buttercup/ui';
import MagicIcon from 'react-icons/lib/fa/magic';

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

const GeneratorToggle = styled.div`
  position: absolute;
  right: 6px;
  top: 4px;
  cursor: pointer;
  padding: 5px;
  border-radius: 2px;
  background-color: ${props => (props.active ? 'var(--gray)' : 'transparent')};

  svg {
    display: block;
  }

  &:hover {
    background-color: var(--gray-light);
  }
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
              <GeneratorToggle active={this.state.isGeneratorOpen}>
                <MagicIcon onClick={() => this.handleGeneratorToggle()} />
              </GeneratorToggle>
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
