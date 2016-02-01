import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { syncHistory, routeReducer } from 'redux-simple-router'
import browserHistory from '../misc/browserHistory'
import DevTools from '../containers/DevTools'
import thunk from 'redux-thunk'
// import api from '../middleware/api'
import createLogger from 'redux-logger'
import {reducer as formReducer} from 'redux-form';
import loadingReducer from '../reducers/loading'
import notificationsReducer from '../reducers/notifications'
import authReducer from '../modules/auth/reducer'
// import rootReducer from '../reducers'

const rootReducer = combineReducers({
  routing: routeReducer,
  form: formReducer,
  loading: loadingReducer,
  notifications: notificationsReducer,
  auth: authReducer
});

const reduxRouterMiddleware = syncHistory(browserHistory);

const finalCreateStore = compose(
  applyMiddleware(thunk),
  applyMiddleware(reduxRouterMiddleware),
  applyMiddleware(createLogger()),
  DevTools.instrument()
)(createStore);


export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // Required for replaying actions from devtools to work
  reduxRouterMiddleware.listenForReplays(store);

  /*
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }
  */

  return store
}
