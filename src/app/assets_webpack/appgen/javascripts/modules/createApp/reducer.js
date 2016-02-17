import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import runDiscoveryStatus from './ducks/runDiscoveryStatus'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  runDiscoveryStatus });
export default rootReducer;