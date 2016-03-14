import { combineReducers } from 'redux';
import properties from './ducks/properties'
import skosConcepts from './ducks/skosConcepts'
import skosConceptsCounts from './ducks/skosConceptsCounts'
import filters from './ducks/filters'
import options from './ducks/options'
import markers from './ducks/markers'

const rootReducer = combineReducers({
  properties,
  skosConcepts,
  skosConceptsCounts,
  filters,
  options,
  markers
});

export default rootReducer;
