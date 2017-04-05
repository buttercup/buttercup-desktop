import React, { Component } from 'react';
import { Button } from 'buttercup-ui';
import { getFsInstance } from '../../../system/auth';
import Selector from '../selector';

class Webdav extends Component {

  state = {
    endpoint: '',
    username: '',
    password: '',
    established: false
  };

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

  render() {
    if (this.state.established) {
      return (
        <Selector fs={this.fs}/>
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
