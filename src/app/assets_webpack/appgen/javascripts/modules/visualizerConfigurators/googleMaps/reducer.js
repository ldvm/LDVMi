import { combineReducers } from 'redux';
import markers from './ducks/markers'
import filters from './ducks/filters'
import mapState from './ducks/mapState'
import toggledMarkers from './ducks/toggledMarkers'
import publishSettings from './ducks/publishSettings'

const rootReducer = combineReducers({
  filters,
  markers,
  mapState,
  toggledMarkers,
  publishSettings
});

export default rootReducer;
