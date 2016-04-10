import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import makeRoutes from './routes';
import Root from './containers/Root';
import configureStore from './redux/configureStore';

// Configure history for react-router
const browserHistory = useRouterHistory(createBrowserHistory)({
    basename: '/Users/sallar/Projects/buttercup/source/public/'
});

// Create redux store and sync with react-router-redux.
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.router
});

// Now that we have the Redux store, we can create our routes.
const routes = makeRoutes(store)

// render the React application to the DOM
ReactDOM.render(
    <Root history={history} routes={routes} store={store} />,
    document.getElementById('root')
);
