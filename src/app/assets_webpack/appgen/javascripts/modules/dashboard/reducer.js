import { combineReducers } from 'redux'
import applications from './ducks/applications'
import discoveries from './ducks/discoveries'
import dataSources from './ducks/dataSources'
import editDataSource from './ducks/editDataSource'

const rootReducer = combineReducers({
  applications,
  discoveries,
  dataSources,
  editDataSource
});

export default rootReducer;
