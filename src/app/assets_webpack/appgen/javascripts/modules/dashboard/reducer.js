import { combineReducers } from 'redux'
import applications from './ducks/applications'
import discoveries from './ducks/discoveries'

const rootReducer = combineReducers({
  applications,
  discoveries
});

export default rootReducer;
