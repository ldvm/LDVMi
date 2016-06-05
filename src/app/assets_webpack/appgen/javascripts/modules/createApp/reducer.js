import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import discovery from './ducks/discovery'
import evaluations from './ducks/evaluations'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  discovery,
  evaluations
});
export default rootReducer;