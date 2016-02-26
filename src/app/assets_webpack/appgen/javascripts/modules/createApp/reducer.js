import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import runDiscoveryStatus from './ducks/runDiscoveryStatus'
import discovery from './ducks/discovery'
import evaluations from './ducks/evaluations'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  runDiscoveryStatus,
  discovery,
  evaluations });
export default rootReducer;