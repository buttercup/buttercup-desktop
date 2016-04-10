import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './rootReducer';
import { mySaga } from './sagas';

export default function configureStore(initialState = {}, history) {
    let middleware = createSagaMiddleware(mySaga);
    const store = createStore(
        rootReducer,
        applyMiddleware(middleware)
    );

    if (module.hot) {
        module.hot.accept('./rootReducer', () => {
            const nextRootReducer = require('./rootReducer').default
            store.replaceReducer(nextRootReducer)
        })
    }

    return store;
}
