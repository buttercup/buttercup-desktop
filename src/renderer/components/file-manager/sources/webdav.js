import React, { Component, PropTypes } from 'react';
import { Button } from 'buttercup-ui';
import { getFsInstance } from '../../../system/auth';
import { isButtercupFile } from '../../../system/utils';
import Manager from '../manager';

class Webdav extends Component {
  static propTypes = {
    onSelect: PropTypes.func
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
      type: 'webdav',
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
    const fs = getFsInstance('webdav', this.state);
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
        <Manager fs={this.fs} onSelectFile={this.handleSelect}/>
      );
    }

    return (
      <form>
        <input type="text" name="endpoint" onChange={this.handleInputChange} value={this.state.endpoint}/>
        <input type="text" name="username" onChange={this.handleInputChange} value={this.state.username}/>
        <input type="password" name="password" onChange={this.handleInputChange} value={this.state.password}/>
        <Button onClick={this.handleConnect}>Connect</Button>
      </form>
    );
  }
}

export default Webdav;
