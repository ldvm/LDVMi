import { combineReducers } from 'redux';
import graph from './ducks/graph'
import searchableLens from './ducks/searchableLens'
import sampleNodeUris from './ducks/sampleNodeUris'
import matrix from './ducks/matrix'
import lists from './ducks/lists'
import selectedList from './ducks/selectedList'
import dirty from './ducks/dirty'
import search from './ducks/search'

const rootReducer = combineReducers({
  graph,
  searchableLens,
  sampleNodeUris,
  matrix,
  lists,
  selectedList,
  dirty,
  search
});

export default rootReducer;
