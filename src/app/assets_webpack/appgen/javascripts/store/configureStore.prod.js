import { createStore, applyMiddleware, compose } from 'redux'
import createHistory from 'history/lib/createBrowserHistory'
import routes from '../routes'
// import thunk from 'redux-thunk'
// import api from '../middleware/api'
// import rootReducer from '../reducers'

const finalCreateStore = compose(
//  applyMiddleware(thunk, api),
)(createStore)

const rootReducer = () => {};

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}
