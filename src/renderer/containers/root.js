import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import WorkspaceContainer from './workspace';

addLocaleData(enLocaleData);

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <IntlProvider locale="en">
        <Provider store={store}>
          <WorkspaceContainer />
        </Provider>
      </IntlProvider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};
