import React, { Component, PropTypes } from 'react';
import { Button } from 'buttercup-ui';
import { authenticateDropbox, getFsInstance } from '../../../system/auth';
import { isButtercupFile } from '../../../system/utils';
import Manager from '../manager';

class Dropbox extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  };

  state = {
    established: false,
    token: null
  };

  handleSelect = path => {
    if (!path || !isButtercupFile(path)) {
      this.props.onSelect(null);
      return;
    }
    this.props.onSelect({
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
      <Button onClick={this.handleAuthClick}>Authenticate</Button>
    );
  }
}

export default Dropbox;
