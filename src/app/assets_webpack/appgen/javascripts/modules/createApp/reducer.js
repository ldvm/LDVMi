import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import runDiscoveryStatus from './ducks/runDiscoveryStatus'
import runEvaluationStatus from './ducks/runEvaluationStatus'
import discovery from './ducks/discovery'
import visualizers from './ducks/visualizers'
import evaluations from './ducks/evaluations'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  runDiscoveryStatus,
  runEvaluationStatus,
  discovery,
  visualizers,
  evaluations });
export default rootReducer;