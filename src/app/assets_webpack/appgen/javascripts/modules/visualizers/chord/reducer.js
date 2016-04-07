import { combineReducers } from 'redux';
import graph from './ducks/graph'
import searchableLens from './ducks/searchableLens'

const rootReducer = combineReducers({
  graph,
  searchableLens
});

export default rootReducer;
