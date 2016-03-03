import { combineReducers } from 'redux';
import properties from './ducks/properties'
import skosConcepts from './ducks/skosConcepts'
import skosConceptsCounts from './ducks/skosConceptsCounts'
import filterConfigs from './ducks/filterConfigs'

const rootReducer = combineReducers({
  properties,
  skosConcepts,
  skosConceptsCounts,
  filterConfigs
});
export default rootReducer;