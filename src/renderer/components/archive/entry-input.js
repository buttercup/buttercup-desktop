import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { Generator, Meter, Input as BaseInput } from '@buttercup/ui';
import MagicIcon from 'react-icons/lib/fa/magic';

export const Wrapper = styled(Flex).attrs({
  align: 'center'
})`
  flex: 1;
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  position: relative;

  font-size: ${props => (props.isTitle ? '1.8rem' : '14px')};
  font-weight: ${props => (props.isTitle ? 300 : 400)};
`;

const PasswordWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const PasswordInput = styled(BaseInput)`
  padding-right: 2.2rem;
  font-size: 14px;
  font-family: Anonymous;
`;

const TitleInput = styled(BaseInput)`
  font-weight: 300;
  font-size: 1.8rem;
  height: auto;
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

export default class Input extends PureComponent {
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
    const { name, value } = input;
    const commonProps = {
      ...input,
      id: name,
      type: 'text',
      placeholder
    };
    return (
      <Wrapper>
        <Choose>
          <When condition={type === 'password'}>
            <PasswordWrapper>
              <PasswordInput
                {...commonProps}
                type={
                  meta.active || this.state.isGeneratorOpen
                    ? 'text'
                    : 'password'
                }
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
              <Meter input={value} />
            </PasswordWrapper>
          </When>
          <When condition={name === 'properties.title'}>
            <TitleInput {...commonProps} />
          </When>
          <Otherwise>
            <BaseInput {...commonProps} />
          </Otherwise>
        </Choose>
      </Wrapper>
    );
  }
}
