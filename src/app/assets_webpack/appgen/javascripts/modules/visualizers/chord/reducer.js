import { combineReducers } from 'redux';
import graph from './ducks/graph'
import nodes from './ducks/nodes'
import searchableLens from './ducks/searchableLens'
import visualizedNodes from './ducks/visualizedNodes'
import matrix from './ducks/matrix'
import lists from './ducks/lists'
import selectedList from './ducks/selectedList'
import dirty from './ducks/dirty'
import search from './ducks/search'
import publishSettings from './ducks/publishSettings'

const rootReducer = combineReducers({
  graph,
  nodes,
  searchableLens,
  visualizedNodes,
  matrix,
  lists,
  selectedList,
  dirty,
  search,
  publishSettings
});

export default rootReducer;
