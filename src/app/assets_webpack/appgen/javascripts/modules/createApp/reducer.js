import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources});
export default rootReducer;