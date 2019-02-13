import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import WorkspaceContainer from './workspace';

export default class Root extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.warn(`%c Attention!`, 'font-size: 40px; color: orange;');
    console.warn(
      `Running commands here can put your vault's contents at great risk - you should never run code here that was given to you or that you found online. If you do not understand what you're doing, we recommend that you close this console.`
    );
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <WorkspaceContainer />
      </Provider>
    );
  }
}
