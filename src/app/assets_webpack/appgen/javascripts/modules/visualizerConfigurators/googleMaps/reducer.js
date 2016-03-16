import { combineReducers } from 'redux';
import markers from './ducks/markers'
import filters from './ducks/filters'
import mapState from './ducks/mapState'
import toggledMarkers from './ducks/toggledMarkers'

const rootReducer = combineReducers({
  filters,
  markers,
  mapState,
  toggledMarkers
});

export default rootReducer;
