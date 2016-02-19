import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import runDiscoveryStatus from './ducks/runDiscoveryStatus'
import discovery from './ducks/discovery'
import visualizers from './ducks/visualizers'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  runDiscoveryStatus,
  discovery,
  visualizers });
export default rootReducer;