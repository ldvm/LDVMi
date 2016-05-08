import { combineReducers } from 'redux'
import latestPublishedApps from './ducks/latestPublishedApps'

const rootReducer = combineReducers({
  latestPublishedApps
});

export default rootReducer;
