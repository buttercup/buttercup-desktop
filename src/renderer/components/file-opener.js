import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'styled-flexbox';
import styled from 'styled-components';
import pkg from '../../../package.json';
import logo from '../styles/img/logo.svg';
import folder from '../styles/img/icons/folder.svg';
import cloudAdd from '../styles/img/icons/cloud-add.svg';
import fileAdd from '../styles/img/icons/file-add.svg';

const Container = styled(Flex)`
  padding: var(--spacing-one) calc(var(--spacing-one) * 5);
  background-color: rgba(255, 255, 255, .85);
  flex: 0 0 65%;
`;

const LogoContainer = styled(Flex)`
  margin-bottom: calc(var(--spacing-one) * 5);
`;

const Small = styled.small`
  font-weight: 300;
  color: var(--gray-dark);
`;

const NavRow = styled(Flex)`
  cursor: pointer;
  padding-bottom: var(--spacing-half);
  margin-bottom: var(--spacing-half);
  border-bottom: 1px dotted var(--gray);
`;
const NavText = props => <Flex flexColumn justify="center" {...props} />;
const NavIcon = styled(Flex)`
  flex: 0 0 48px;

  img {
    width: 36px;
    height: auto;
  }
`;

class FileOpener extends Component {
  render() {
    return (
      <Container flexColumn justify="center">
        <LogoContainer flexColumn align="center" justify="center">
          <img src={logo} alt="Buttercup" width="130" />
          <Small>v{pkg.version}</Small>
        </LogoContainer>
        <Box>
          <div>
            <NavRow onClick={this.props.onOpenClick}>
              <NavIcon align="center">
                <img src={folder} />
              </NavIcon>
              <NavText>
                <FormattedMessage id="opener.open" defaultMessage="Open Archive" />
                <Small>
                  <FormattedMessage id="opener.open.desc" defaultMessage="Load your offline archive" />
                </Small>
              </NavText>
            </NavRow>
            <NavRow onClick={this.props.onNewClick}>
              <NavIcon align="center">
                <img src={fileAdd} />
              </NavIcon>
              <NavText>
                <FormattedMessage id="opener.new" defaultMessage="New Archive" />
                <Small>
                  <FormattedMessage id="opener.new.desc" defaultMessage="Create an offline archive" />
                </Small>
              </NavText>
            </NavRow>
            <NavRow onClick={this.props.onCloudClick}>
              <NavIcon align="center">
                <img src={cloudAdd} />
              </NavIcon>
              <NavText>
                <FormattedMessage id="opener.from.cloud" defaultMessage="Load from Cloud Services" />
                <Small>
                  <FormattedMessage id="opener.from.cloud.desc" defaultMessage="Connect to Dropbox, OwnCloud, etc." />
                </Small>
              </NavText>
            </NavRow>
          </div>
        </Box>
      </Container>
    );
  }
}

FileOpener.propTypes = {
  onOpenClick: PropTypes.func,
  onNewClick: PropTypes.func,
  onCloudClick: PropTypes.func
};

export default FileOpener;
