import { combineReducers } from 'redux';
import markers from './ducks/markers'
import filters from './ducks/filters'

const rootReducer = combineReducers({
  filters,
  markers
});

export default rootReducer;
