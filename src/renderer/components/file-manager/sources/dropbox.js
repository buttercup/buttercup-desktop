import React, { Component, PropTypes } from 'react';
import { Button } from 'buttercup-ui';
import { authenticateDropbox } from '../../../system/auth';
import Manager from '../manager';


class Dropbox extends Component {

  state = {
    accessToken: null
  };

  handleAuthClick = () => {
    authenticateDropbox()
      .then(token => {
        this.setState({
          accessToken: token
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.accessToken) {
      return (
        <Manager
          onSelectFile={file => {
            console.log(file);
          }}
          token={this.state.accessToken}
          />
      );
    }

    return (
      <Button onClick={this.handleAuthClick}>Authenticate</Button>
    );
  }
}

export default Dropbox;
