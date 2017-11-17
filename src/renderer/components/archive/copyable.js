import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import CopyIcon from 'react-icons/lib/go/clippy';
import EyeIcon from 'react-icons/lib/fa/eye';
import EyeSlashIcon from 'react-icons/lib/fa/eye-slash';
import { Button, ButtonRow, ColoredDigits } from '@buttercup/ui';
import { injectIntl, intlShape } from 'react-intl';
import { showContextMenu } from '../../system/menu';
import { copyToClipboard } from '../../system/utils';

const Password = styled(ColoredDigits)`
  font-family: Anonymous;
  font-size: 14px;
  font-weight: bold;

  .num {
    color: var(--brand-primary-darker);
  }
`;

const HiddenButtonRow = styled(ButtonRow)`
  > button {
    opacity: 0;
    margin-right: 2px;
  }
`;

const Wrapper = styled(Flex)`
  padding-left: var(--spacing-half);
  margin-left: 2px;
  line-height: 1.2;

  &:hover {
    button {
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  word-break: break-all;
  padding: 8px 0 6px;
  font-size: 0.95rem;
`;

class Copyable extends Component {
  static propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    intl: intlShape.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      concealed: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setState({ concealed: true });
    }
  }

  showContextMenu() {
    const { type, intl } = this.props;
    const items = [
      {
        label: intl.formatMessage({
          id: 'copy-to-clipboard',
          defaultMessage: 'Copy to Clipboard'
        }),
        click: () => this.handleCopy()
      }
    ];

    if ((type || '').toLowerCase() === 'password') {
      items.push({
        label: intl.formatMessage({
          id: 'reveal-password',
          defaultMessage: 'Reveal Password'
        }),
        type: 'checkbox',
        checked: !this.state.concealed,
        click: () => this.handleReveal()
      });
    }

    showContextMenu(items);
  }

  handleReveal() {
    this.setState({ concealed: !this.state.concealed });
  }

  handleCopy() {
    copyToClipboard(this.props.children);
  }

  renderPassword(content) {
    return (
      <Password
        role="content"
        value={content}
        concealed={this.state.concealed}
      />
    );
  }

  render() {
    const { children, type, intl } = this.props;
    if (!children) {
      return null;
    }

    return (
      <Wrapper onContextMenu={() => this.showContextMenu()}>
        <Content role="content">
          {type === 'password' ? this.renderPassword(children) : children}
        </Content>
        <HiddenButtonRow>
          {(type || '').toLowerCase() === 'password' && (
            <Button
              icon={this.state.concealed ? <EyeIcon /> : <EyeSlashIcon />}
              title={
                this.state.concealed
                  ? intl.formatMessage({
                      id: 'reveal',
                      defaultMessage: 'Reveal'
                    })
                  : intl.formatMessage({
                      id: 'hide',
                      defaultMessage: 'Hide'
                    })
              }
              onClick={() => this.handleReveal()}
            />
          )}
          <Button
            icon={<CopyIcon />}
            title={intl.formatMessage({
              id: 'copy',
              defaultMessage: 'Copy'
            })}
            onClick={() => this.handleCopy()}
          />
        </HiddenButtonRow>
      </Wrapper>
    );
  }
}

export default injectIntl(Copyable);
