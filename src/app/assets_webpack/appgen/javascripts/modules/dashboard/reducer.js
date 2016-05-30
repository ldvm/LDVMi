import { combineReducers } from 'redux'
import applications from './ducks/applications'
import discoveries from './ducks/discoveries'
import dataSources from './ducks/dataSources'

const rootReducer = combineReducers({
  applications,
  discoveries,
  dataSources
});

export default rootReducer;
