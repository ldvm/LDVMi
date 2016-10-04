import { combineReducers } from 'redux';
import markers from './ducks/markers'
import filters from './ducks/filters'
import mapState from './ducks/mapState'
import toggledMarkers from './ducks/toggledMarkers'
import publishSettings from './ducks/publishSettings'
import dirty from './ducks/dirty'

const rootReducer = combineReducers({
  filters,
  markers,
  mapState,
  toggledMarkers,
  publishSettings,
  dirty
});

export default rootReducer;
