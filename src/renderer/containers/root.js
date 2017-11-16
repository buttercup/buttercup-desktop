import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import WorkspaceContainer from './workspace';

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <WorkspaceContainer />
      </Provider>
    );
  }
}
