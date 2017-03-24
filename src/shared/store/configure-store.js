import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import {
  forwardToMain,
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
  replayActionRenderer,
} from 'electron-redux';
import getRootReducer from '../reducers';

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @return {Object} store
 */
export default function configureStore(initialState, scope = 'main') {
  let middleware = [
    thunk,
    promise,
  ];

  if (scope === 'renderer') {
    middleware = [
      forwardToMain,
      ...middleware,
    ];

    if (process.env.NODE_ENV === 'development') {
      const logger = createLogger({
        level: 'info',
        collapsed: true,
      });
      middleware = [
        ...middleware,
        logger
      ];
    }
  }

  if (scope === 'main') {
    middleware = [
      triggerAlias,
      ...middleware,
      forwardToRenderer,
    ];
  }

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  if (process.env.NODE_ENV === 'development' && scope === 'renderer') {
    enhanced.push(window.devToolsExtension ? window.devToolsExtension() : f => f);
  }

  const rootReducer = getRootReducer(scope);
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}
