import { combineReducers } from 'redux'
import markers from './ducks/markers'
import filters from './ducks/filters'
import mapState from './ducks/mapState'
import toggledMarkers from './ducks/toggledMarkers'
import publishSettings from './ducks/publishSettings'
import coordinates from './ducks/coordinates'
import places from './ducks/places'
import quantifiedThings from './ducks/quantifiedThings'
import quantifiedPlaces from './ducks/quantifiedPlaces'
import selectedPlacePredicates from './ducks/selectedPlacePredicates'
import selectedValuePredicates from './ducks/selectedValuePredicates'
import selectedPlaceTypes from './ducks/selectedPlaceTypes'
import selectedQuantifiedThings from './ducks/selectedQuantifiedThings'
import colors from './ducks/colors'
import count from './ducks/counts'
import dirty from './ducks/dirty'

const rootReducer = combineReducers({
  filters,
  markers,
  mapState,
  toggledMarkers,
  publishSettings,
  coordinates,
  places,
  quantifiedThings,
  quantifiedPlaces,
  selectedQuantifiedThings,
  selectedPlacePredicates,
  selectedValuePredicates,
  selectedPlaceTypes,
  colors,
  count,
  dirty
});

export default rootReducer;
