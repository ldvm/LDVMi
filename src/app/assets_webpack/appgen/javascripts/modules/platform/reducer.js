import { combineReducers } from 'redux'
import latestPublishedApps from './ducks/latestPublishedApps'
import latestUserApps from './ducks/latestUserApps'
import publishedApps from './ducks/publishedApps'

const rootReducer = combineReducers({
  latestPublishedApps,
  latestUserApps,
  publishedApps
});

export default rootReducer;
