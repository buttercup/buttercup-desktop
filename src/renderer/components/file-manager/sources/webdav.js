import PropTypes from 'prop-types';
import React, { Component } from 'react';
import url from 'url';
import InfoIcon from 'react-icons/lib/md/info-outline';
import { Button, SmallType, Input } from '@buttercup/ui';
import { Flex } from 'styled-flexbox';
import styled from 'styled-components';
import {
  injectIntl,
  intlShape,
  FormattedHTMLMessage,
  FormattedMessage
} from 'react-intl';
import { brands } from '../../../../shared/buttercup/brands';
import { getFsInstance } from '../../../system/auth';
import { isButtercupFile } from '../../../system/utils';
import { showDialog } from '../../../system/dialog';
import Manager from '../manager';

const Form = styled.form`
  width: 80%;

  input {
    margin-bottom: var(--spacing-half);
  }
`;

class Webdav extends Component {
  state = {
    endpoint: '',
    username: '',
    password: '',
    established: false
  };

  handleSelect = (filePath, isNew) => {
    const { onSelect, brand } = this.props;

    if (!filePath || !isButtercupFile(filePath)) {
      onSelect(null);
      return;
    }
    this.props.onSelect({
      type: brand || 'webdav',
      path: filePath,
      endpoint: this.state.endpoint,
      credentials: {
        username: this.state.username,
        password: this.state.password
      },
      isNew
    });
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleConnect = e => {
    if (e) {
      e.preventDefault();
    }

    let { endpoint, username, password } = this.state;
    const { brand, intl } = this.props;

    if (!endpoint || !username || !password) {
      return;
    }

    endpoint = endpoint.substr(-1) !== '/' ? `${endpoint}/` : endpoint;
    endpoint = ['owncloud', 'nextcloud'].includes(brand)
      ? url.resolve(endpoint, './remote.php/webdav')
      : endpoint;

    const fs = getFsInstance('webdav', {
      endpoint,
      username,
      password
    });

    fs
      .readDirectory('/')
      .then(() => {
        this.fs = fs;
        this.setState({
          established: true
        });
      })
      .catch(err => {
        console.error(err);
        showDialog(
          intl.formatMessage(
            {
              id: 'webdav-connection-failed-info',
              defaultMessage:
                'Connection to {endpoint} failed. Please check your credentials and try again.'
            },
            {
              endpoint
            }
          )
        );
      });
  };

  componentDidMount() {
    this.props.onSelect(null);
  }

  render() {
    const { intl } = this.props;
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

    const title = brands[this.props.brand || 'webdav'].name;

    return (
      <Flex align="center" justify="center" flexColumn flexAuto>
        <h2>
          <FormattedMessage
            id="connect-to-wedav"
            defaultMessage="Connect to {title} Server"
            values={{ title }}
          />
        </h2>
        <Form onSubmit={this.handleConnect}>
          <Input
            bordered
            type="text"
            name="endpoint"
            placeholder="https://..."
            onChange={this.handleInputChange}
            value={this.state.endpoint}
          />
          <Input
            bordered
            type="text"
            name="username"
            placeholder={`${title} ${intl.formatMessage({
              id: 'username',
              defaultMessage: 'Username'
            })}...`}
            onChange={this.handleInputChange}
            value={this.state.username}
          />
          <Input
            bordered
            type="password"
            name="password"
            placeholder={`${title} ${intl.formatMessage({
              id: 'password',
              defaultMessage: 'Password'
            })}...`}
            onChange={this.handleInputChange}
            value={this.state.password}
          />
          <Button type="submit" onClick={this.handleConnect} full primary>
            <FormattedMessage id="connect" defaultMessage="Connect" />
          </Button>
          <SmallType border center>
            <InfoIcon />{' '}
            <FormattedHTMLMessage
              id="webdav-description-text"
              defaultMessage="Enter your {title} Endpoint Address, Username and Password to connect and choose a Buttercup Archive. We <strong>will save</strong> your credentials and encrypt it."
              values={{ title }}
            />
          </SmallType>
        </Form>
      </Flex>
    );
  }
}

Webdav.propTypes = {
  onSelect: PropTypes.func,
  toggleCreateButton: PropTypes.func,
  brand: PropTypes.string,
  intl: intlShape.isRequired
};

export default injectIntl(Webdav);
