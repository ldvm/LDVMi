import { combineReducers } from 'redux'
import applications from './ducks/applications'
import discoveries from './ducks/discoveries'
import dataSources from './ducks/dataSources'
import editDataSource from './ducks/editDataSource'
import visualizerComponents from './ducks/visualizerComponents'

const rootReducer = combineReducers({
  applications,
  discoveries,
  dataSources,
  editDataSource,
  visualizerComponents
});

export default rootReducer;
