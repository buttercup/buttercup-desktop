import React, { Component, PropTypes } from 'react';
import InfoIcon from 'react-icons/lib/md/info-outline';
import { Button, SmallType, Input } from 'buttercup-ui';
import styled from 'styled-components';
import { getFsInstance } from '../../../system/auth';
import { isButtercupFile } from '../../../system/utils';
import { Flex } from '../tools';
import Manager from '../manager';

const Form = styled.form`
  width: 80%;
  
  input {
    margin-bottom: var(--spacing-half);
  }
`;

class Webdav extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    owncloud: PropTypes.bool
  };

  state = {
    endpoint: '',
    username: '',
    password: '',
    established: false
  };

  handleSelect = path => {
    if (!path || !isButtercupFile(path)) {
      this.props.onSelect(null);
      return;
    }
    this.props.onSelect({
      type: this.props.owncloud ? 'owncloud' : 'webdav',
      path,
      endpoint: this.state.endpoint,
      credentials: {
        username: this.state.username,
        password: this.state.password
      },
      isNew: false
    });
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleConnect = () => {
    const fs = getFsInstance(this.props.owncloud ? 'owncloud' : 'webdav', this.state);
    fs.readDirectory('/').then(() => {
      this.fs = fs;
      this.setState({
        established: true
      });
    }).catch(err => {
      console.error(err);
    });
  }

  componentDidMount() {
    this.props.onSelect(null);
  }

  render() {
    if (this.state.established) {
      return (
        <Flex flexAuto>
          <Manager fs={this.fs} onSelectFile={this.handleSelect} />
        </Flex>
      );
    }

    const title = this.props.owncloud ? 'OwnCloud' : 'WebDAV';

    return (
      <Flex align="center" justify="center" flexColumn flexAuto>
        <h2>Connect to {title} Server</h2>
        <Form>
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
            placeholder={`${title} Username...`}
            onChange={this.handleInputChange}
            value={this.state.username}
            />
          <Input
            bordered
            type="password"
            name="password"
            placeholder={`${title} Password...`}
            onChange={this.handleInputChange}
            value={this.state.password}
            />
          <Button onClick={this.handleConnect} full primary>Connect</Button>
          <SmallType border center>
            <InfoIcon /> Enter your {title} Endpoint Address, Username and Password to connect and choose a Buttercup Archive. We <strong>will save</strong> your credentials and encrypt it.
          </SmallType>
        </Form>
      </Flex>
    );
  }
}

export default Webdav;
