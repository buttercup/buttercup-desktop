import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import {
  GoClippy as CopyIcon,
  GoLinkExternal as UrlIcon
} from 'react-icons/go';
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon } from 'react-icons/fa';
import { Button, ButtonRow, ColoredDigits } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { showContextMenu } from '../../system/menu';
import { copyToClipboard, isUrl, openUrl } from '../../system/utils';

const Password = styled(ColoredDigits)`
  font-family: Anonymous;
  font-size: 1em;
  font-weight: bold;
  user-select: all !important;

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
  flex: 1;

  &:hover {
    button {
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  word-break: break-all;
  padding: 7px 0 6px;
`;

const EmptyField = styled.span`
  color: var(--black-20);
  cursor: default;
`;

class Copyable extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    isSecret: PropTypes.bool,
    t: PropTypes.func,
    secondsUntilClearClipboard: PropTypes.number
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
    const { isSecret, t } = this.props;
    const items = [
      {
        label: t('copyable-menu.copy-to-clipboard'),
        click: () => this.handleCopy()
      }
    ];

    if (isSecret) {
      items.push({
        label: t('copyable-menu.reveal-password'),
        type: 'checkbox',
        checked: !this.state.concealed,
        click: () => this.handleReveal()
      });
    }

    if (!isSecret && isUrl(children)) {
      items.push({
        label: t('copyable-menu.open-url-in-browser'),
        click: () => this.handleOpenUrlInBrowser()
      });
    }

    showContextMenu(items);
  }

  handleOpenUrlInBrowser() {
    openUrl(this.props.children);
  }

  handleReveal() {
    this.setState({ concealed: !this.state.concealed });
  }

  handleCopy(isSecret) {
    copyToClipboard(
      this.props.children,
      isSecret,
      this.props.secondsUntilClearClipboard
    );
  }

  renderPassword(content) {
    return (
      <Password
        role="content"
        value={content}
        concealed={this.state.concealed}
        onCopy={e => {
          e.preventDefault();
          this.handleCopy(true);
        }}
      />
    );
  }

  render() {
    const { children, isSecret, t } = this.props;

    return (
      <Wrapper onContextMenu={() => this.showContextMenu()}>
        <Content role="content">
          <Choose>
            <When condition={children}>
              {isSecret ? this.renderPassword(children) : children}
            </When>
            <Otherwise>
              <EmptyField>{t('entry.no-value')}</EmptyField>
            </Otherwise>
          </Choose>
        </Content>
        <If condition={children}>
          <HiddenButtonRow>
            <If condition={isSecret}>
              <Button
                icon={this.state.concealed ? <EyeIcon /> : <EyeSlashIcon />}
                title={
                  this.state.concealed
                    ? t('copyable.reveal')
                    : t('copyable.hide')
                }
                onClick={() => this.handleReveal()}
              />
            </If>
            <If condition={!isSecret && isUrl(children)}>
              <Button
                icon={<UrlIcon />}
                title={t('copyable.open-url-in-browser')}
                onClick={() => this.handleOpenUrlInBrowser()}
              />
            </If>
            <Button
              icon={<CopyIcon />}
              title={t('copyable.copy')}
              onClick={() => this.handleCopy(isSecret)}
            />
          </HiddenButtonRow>
        </If>
      </Wrapper>
    );
  }
}

export default translate()(Copyable);
