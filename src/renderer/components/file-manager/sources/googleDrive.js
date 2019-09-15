import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { FaGoogleDrive as GoogleDriveIcon } from 'react-icons/fa';
import { MdInfoOutline as InfoIcon } from 'react-icons/md';
import { Button, SmallType, Center } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { Translate } from '../../../../shared/i18n';
import { Flex } from 'styled-flexbox';
import { getFsInstance, authenticateGoogleDrive } from '../../../system/auth';
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
    // authenticateGoogleDrive().then(tok => {
    //   console.log(tok);
    // });
    const token =
      '4/rAF8X3qNIPipkOSpFDbYkJ8lFPuD2bxRflbEuX0Ax6Etla-E3jpoJcs73nsYL7AKZ1k6MIOli_pFUl0Kb6oc1MQ';
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
