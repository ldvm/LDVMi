import { combineReducers } from 'redux'
import latestPublishedApps from './ducks/latestPublishedApps'
import latestUserApps from './ducks/latestUserApps'
import publishedApps from './ducks/publishedApps'
import install from './ducks/install'

const rootReducer = combineReducers({
  latestPublishedApps,
  latestUserApps,
  publishedApps,
  install
});

export default rootReducer;
