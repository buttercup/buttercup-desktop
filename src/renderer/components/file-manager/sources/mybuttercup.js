import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import mybuttercupLogo from '../../../styles/img/logos/mybuttercup.svg';
import { MdInfoOutline as InfoIcon } from 'react-icons/md';
import { Button, SmallType, Center } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { Translate } from '../../../../shared/i18n';
import { Flex } from 'styled-flexbox';
import {
  authenticateMyButtercup,
  exchangeMyButtercupAuthCode,
  getMyButtercupAccountDetails
} from '../../../system/auth';
import { showDialog } from '../../../system/dialog';

const ConnectButton = styled(Button)`
  display: inline-flex;
`;

const Wrapper = styled(Center)`
  width: 80%;
`;

const Logo = styled.img`
  margin-right: var(--spacing-half);
  width: 16px;
  height: 16px;
  filter: brightness(0) invert();
`;

class MyButtercup extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    // toggleCreateButton: PropTypes.func,
    t: PropTypes.func
  };

  state = {
    established: false,
    details: null
  };

  handleAuthClick = () => {
    const { t } = this.props;
    authenticateMyButtercup()
      .then(authCode => exchangeMyButtercupAuthCode(authCode))
      .then(tokens =>
        getMyButtercupAccountDetails(
          tokens.accessToken,
          tokens.refreshToken
        ).then(details => ({
          ...details,
          ...tokens
        }))
      )
      .then(details => {
        this.setState({
          established: true,
          details
        });
        this.props.onSelect({
          type: 'mybuttercup',
          details,
          isNew: false
        });
      })
      .catch(err => {
        console.error(err);
        showDialog(t('error.mybuttercup-connection-failed-info'));
      });
  };

  componentDidMount() {
    this.props.onSelect(null);
  }

  render() {
    return (
      <Flex align="center" justify="center" flexColumn flexAuto>
        <Wrapper>
          <h2>
            <Translate i18nKey="cloud-source.connect-to-mybuttercup" />
          </h2>
          <ConnectButton
            large
            primary
            onClick={this.handleAuthClick}
            icon={<Logo src={mybuttercupLogo} />}
            disabled={this.state.established}
          >
            <Translate i18nKey="cloud-source.authenticate-with-mybuttercup" />
          </ConnectButton>
          <SmallType border>
            <InfoIcon />{' '}
            <Translate
              html
              i18nKey="cloud-source.mybuttercup-description-text"
            />
          </SmallType>
        </Wrapper>
      </Flex>
    );
  }
}

export default translate()(MyButtercup);
