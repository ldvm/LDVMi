import { combineReducers } from 'redux';
import properties from './ducks/properties'
import skosConcepts from './ducks/skosConcepts'
import skosConceptsCounts from './ducks/skosConceptsCounts'
import filterConfigs from './ducks/filterConfigs'
import propertyConfigs from './ducks/propertyConfigs'
import selectedFilters from './ducks/selectedFilters'
import markers from './ducks/markers'

const rootReducer = combineReducers({
  properties,
  skosConcepts,
  skosConceptsCounts,
  filterConfigs,
  propertyConfigs,
  selectedFilters,
  markers
});

export default rootReducer;
