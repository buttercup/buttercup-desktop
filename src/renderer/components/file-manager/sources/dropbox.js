import React, { Component } from 'react';
import { Button } from 'buttercup-ui';
import { authenticateDropbox, getFsInstance } from '../../../system/auth';
import Selector from '../selector';

class Dropbox extends Component {
  state = {
    established: false
  };

  handleAuthClick = () => {
    authenticateDropbox()
      .then(token => {
        this.fs = getFsInstance('dropbox', { token });
        this.setState({
          established: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.established) {
      return (
        <Selector fs={this.fs}/>
      );
    }

    return (
      <Button onClick={this.handleAuthClick}>Authenticate</Button>
    );
  }
}

export default Dropbox;
