import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import DropboxIcon from 'react-icons/lib/fa/dropbox';
import InfoIcon from 'react-icons/lib/md/info-outline';
import { Button, SmallType, Center } from '@buttercup/ui';
import { Flex } from 'styled-flexbox';
import { authenticateDropbox, getFsInstance } from '../../../system/auth';
import { isButtercupFile } from '../../../system/utils';
import { showDialog } from '../../../system/dialog';
import Manager from '../manager';

const DropboxButton = styled(Button)`
  background-color: #007ee5 !important;
  color: #fff !important;
`;

const Wrapper = styled(Center)`
  width: 80%;
`;

class Dropbox extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    toggleCreateButton: PropTypes.func
  };

  state = {
    established: false,
    token: null
  };

  handleSelect = (filePath, isNew) => {
    if (!filePath || !isButtercupFile(filePath)) {
      this.props.onSelect(null);
      return;
    }
    this.props.onSelect({
      type: 'dropbox',
      token: this.state.token,
      path: filePath,
      isNew
    });
  };

  handleAuthClick = () => {
    authenticateDropbox()
      .then(token => {
        this.fs = getFsInstance('dropbox', { token });
        this.setState({
          established: true,
          token
        });
      })
      .catch(err => {
        console.error(err);
        showDialog(
          `Connection to Dropbox server failed. Please try again later.`
        );
      });
  };

  componentDidMount() {
    this.props.onSelect(null);
  }

  render() {
    if (this.state.established) {
      return (
        <Flex flexAuto>
          <Manager
            fs={this.fs}
            onSelectFile={this.handleSelect}
            toggleCreateButton={this.props.toggleCreateButton}
          />
        </Flex>
      );
    }

    return (
      <Flex align="center" justify="center" flexColumn flexAuto>
        <Wrapper>
          <h2>Connect to Dropbox</h2>
          <DropboxButton
            large
            onClick={this.handleAuthClick}
            icon={<DropboxIcon />}
          >
            Authenticate with Dropbox
          </DropboxButton>
          <SmallType border>
            <InfoIcon /> Connect Buttercup to your Dropbox account to read and
            save your archives.<br />
            We won't save your Dropbox username or password.
          </SmallType>
        </Wrapper>
      </Flex>
    );
  }
}

export default Dropbox;
