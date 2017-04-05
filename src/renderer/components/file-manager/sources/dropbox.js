import React, { Component } from 'react';
import { Button } from 'buttercup-ui';
import { authenticateDropbox, getFsInstance } from '../../../system/auth';
import { emitActionToParentAndClose } from '../../../system/utils';
import Selector from '../selector';

class Dropbox extends Component {
  state = {
    established: false,
    token: null
  };

  handleSelect = path => {
    emitActionToParentAndClose('load-archive', {
      type: 'dropbox',
      token: this.state.token,
      isNew: false,
      path
    });
  }

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
        console.log(err);
      });
  }

  render() {
    if (this.state.established) {
      return (
        <Selector fs={this.fs} onSelect={this.handleSelect}/>
      );
    }

    return (
      <Button onClick={this.handleAuthClick}>Authenticate</Button>
    );
  }
}

export default Dropbox;
