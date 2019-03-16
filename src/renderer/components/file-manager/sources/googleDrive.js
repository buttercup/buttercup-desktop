import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import GoogleDriveIcon from 'react-icons/lib/fa/google-drive';
import InfoIcon from 'react-icons/lib/md/info-outline';
import { Button, SmallType, Center } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { Translate } from '../../../../shared/i18n';
import { Flex } from 'styled-flexbox';
import { authenticateDropbox, getFsInstance } from '../../../system/auth';
import { isButtercupFile } from '../../../system/utils';
import { showDialog } from '../../../system/dialog';
import Manager from '../manager';

const GoogleDriveButton = styled(Button)`
  background-color: #007ee5 !important;
  color: #fff !important;
`;

const Wrapper = styled(Center)`
  width: 80%;
`;

class GoogleDrive extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    toggleCreateButton: PropTypes.func,
    t: PropTypes.func
  };

  state = {
    established: false,
    token: null
  };

  handleSelect = (fileID, isNew) => {
    if (!filePath || !isButtercupFile(filePath)) {
      this.props.onSelect(null);
      return;
    }
    this.props.onSelect({
      type: 'googledrive',
      token: this.state.token,
      path: fileID,
      isNew
    });
  };

  handleAuthClick = () => {
    // const { t } = this.props;
    // authenticateDropbox()
    //   .then(token => {
    //     this.fs = getFsInstance('dropbox', { token });
    //     this.setState({
    //       established: true,
    //       token
    //     });
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     showDialog(t('error.dropbox-connection-failed-info'));
    //   });
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
          <h2>
            <Translate i18nKey="cloud-source.connect-to-googledrive" />
          </h2>
          <GoogleDriveButton
            large
            onClick={this.handleAuthClick}
            icon={<GoogleDriveIcon />}
          >
            <Translate i18nKey="cloud-source.authenticate-with-googledrive" />
          </GoogleDriveButton>
          <SmallType border>
            <InfoIcon />{' '}
            <Translate
              html
              i18nKey="cloud-source.googledrive-description-text"
            />
          </SmallType>
        </Wrapper>
      </Flex>
    );
  }
}

export default translate()(GoogleDrive);
