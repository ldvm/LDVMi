import { combineReducers } from 'redux';
import properties from './ducks/properties'
import skosConcepts from './ducks/skosConcepts'
import skosConceptsCounts from './ducks/skosConceptsCounts'

const rootReducer = combineReducers({
  properties,
  skosConcepts,
  skosConceptsCounts
});
export default rootReducer;