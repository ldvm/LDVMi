import { combineReducers } from 'redux'
import applications from './ducks/applications'

const rootReducer = combineReducers({
  applications
});

export default rootReducer;
