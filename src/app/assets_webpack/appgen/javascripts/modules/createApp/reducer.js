import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'
import selectedDataSources from './ducks/selectedDataSources'
import discovery from './ducks/discovery'
import evaluations from './ducks/evaluations'
import selectedVisualizer from './ducks/selectedVisualizer'

const rootReducer = combineReducers({
  dataSources,
  selectedDataSources,
  discovery,
  evaluations,
  selectedVisualizer
});
export default rootReducer;