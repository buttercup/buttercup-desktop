import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { electronEnhancer } from 'redux-electron-store';
import getRootReducer from '../reducers';

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @return {Object} store
 */
export default function configureStore(initialState, scope = 'main') {
  let middleware = [thunk];

  if (scope === 'renderer' && process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      level: 'info',
      collapsed: true
    });
    middleware = [...middleware, logger];
  }

  const enhanced = [applyMiddleware(...middleware)];

  const filter = {
    settingsByArchiveId: true,
    archives: true,
    update: true,
    settings: true
  };

  if (scope === 'renderer') {
    enhanced.push(
      electronEnhancer({
        filter,
        dispatchProxy: a => store.dispatch(a)
      })
    );
    if (process.env.NODE_ENV === 'development') {
      enhanced.push(
        window.devToolsExtension ? window.devToolsExtension() : f => f
      );
    }
  } else {
    enhanced.push(
      electronEnhancer({
        dispatchProxy: a => store.dispatch(a)
      })
    );
  }

  const rootReducer = getRootReducer(scope);
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reloading
  if (process.env.NODE_ENV === 'development' && module.hot) {
    if (scope === 'renderer') {
      const { ipcRenderer } = require('electron');
      module.hot.accept('../reducers', () => {
        ipcRenderer.sendSync('renderer-reload');
        store.replaceReducer(require('../reducers'));
      });
    } else {
      const { ipcMain } = require('electron');
      ipcMain.on('renderer-reload', event => {
        delete require.cache[require.resolve('../reducers')];
        store.replaceReducer(require('../reducers'));
        event.returnValue = true;
      });
    }
  }

  return store;
}
