import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import runDiscoveryStatus from './ducks/runDiscoveryStatus'
import discovery from './ducks/discovery'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  runDiscoveryStatus,
  discovery });
export default rootReducer;