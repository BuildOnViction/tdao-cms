/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './store/reducers';
import thunk from 'redux-thunk';
import apiMiddleware from 'store/middleware/api-middleware';
import pendingApiMiddleware from 'store/middleware/pending-api-middleware';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import routeMiddleware from 'store/middleware/route-middleware';

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['persist','jobs','admins','brokers','users']
}
export default function configureStore(initialState = {}, history) {
    const middlewares = [
        // sagaMiddleware,
        routerMiddleware(history),
        thunk,
        apiMiddleware,
        pendingApiMiddleware
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
    /* eslint-enable */

    const persistedReducer = persistReducer(persistConfig, rootReducer)

    const store = createStore(
        persistedReducer,
        {},
        composeEnhancers(...enhancers)
    );
    let persistor = persistStore(store, null, (state)=> {
    });

    // Extensions
    store.runSaga = sagaMiddleware.run;
    store.asyncReducers = {}; // Async reducer registry

    // Make reducers hot reloadable, see http://mxs.is/googmo
    /* istanbul ignore next */
    if (module.hot) {
        module.hot.accept('./store/reducers', () => {
            import('./store/reducers').then((reducerModule) => {
                const createReducers = reducerModule.default;
                const nextReducers = createReducers(store.asyncReducers);

                store.replaceReducer(nextReducers);
            });
        });
    }

    return {
        store, persistor
    };
}
