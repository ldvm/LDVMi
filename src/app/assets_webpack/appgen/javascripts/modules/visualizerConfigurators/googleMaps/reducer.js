import { combineReducers } from 'redux';
import markers from './ducks/markers'
import filters from './ducks/filters'
import mapState from './ducks/mapState'

const rootReducer = combineReducers({
  filters,
  markers,
  mapState
});

export default rootReducer;
