import { combineReducers } from 'redux';
import graph from './ducks/graph'
import searchableLens from './ducks/searchableLens'
import sampleNodeUris from './ducks/sampleNodeUris'
import matrix from './ducks/matrix'

const rootReducer = combineReducers({
  graph,
  searchableLens,
  sampleNodeUris,
  matrix
});

export default rootReducer;
