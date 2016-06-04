import { combineReducers } from 'redux'
import applications from './ducks/applications'
import discoveries from './ducks/discoveries'
import dataSources from './ducks/dataSources'
import editDataSource from './ducks/editDataSource'
import visualizerComponents from './ducks/visualizerComponents'
import editVisualizer from './ducks/editVisualizer'

const rootReducer = combineReducers({
  applications,
  discoveries,
  dataSources,
  editDataSource,
  visualizerComponents,
  editVisualizer
});

export default rootReducer;
