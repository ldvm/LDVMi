import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { syncHistory, routeReducer } from 'redux-simple-router'
import browserHistory from '../misc/browserHistory'
import DevTools from '../containers/DevTools'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './rootReducer'
import { paginationMiddleware } from '../modules/core/ducks/pagination'

const reduxRouterMiddleware = syncHistory(browserHistory);

const finalCreateStore = compose(
  applyMiddleware(
    thunk,
    promiseMiddleware({promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']}),
    paginationMiddleware
  ),
  applyMiddleware(reduxRouterMiddleware)
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // Required for replaying actions from devtools to work
  reduxRouterMiddleware.listenForReplays(store);

  return store
}
