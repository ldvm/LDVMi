import { combineReducers } from 'redux'
import latestPublishedApps from './ducks/latestPublishedApps'
import latestUserApps from './ducks/latestUserApps'

const rootReducer = combineReducers({
  latestPublishedApps,
  latestUserApps
});

export default rootReducer;
