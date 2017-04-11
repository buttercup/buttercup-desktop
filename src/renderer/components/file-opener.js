import React, { Component, PropTypes } from 'react';
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
          <img src={logo} alt="Buttercup" width="130"/>
          <Small>v{pkg.version}-alpha</Small>
        </LogoContainer>
        <Box>
          <div>
            <NavRow onClick={this.props.onOpenClick}>
              <NavIcon align="center">
                <img src={folder} />
              </NavIcon>
              <NavText>
                <span>Open Archive</span>
                <Small>Load your offline archive</Small>
              </NavText>
            </NavRow>
            <NavRow onClick={this.props.onNewClick}>
              <NavIcon align="center">
                <img src={fileAdd} />
              </NavIcon>
              <NavText>
                <span>New Archive</span>
                <Small>Create an offline archive</Small>
              </NavText>
            </NavRow>
            <NavRow onClick={this.props.onCloudClick}>
              <NavIcon align="center">
                <img src={cloudAdd} />
              </NavIcon>
              <NavText>
                <span>Load from Cloud Services</span>
                <Small>Connect to Dropbox, OwnCloud, etc.</Small>
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
