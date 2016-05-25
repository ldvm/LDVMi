import { combineReducers } from 'redux'
import applications, { paginatedApplicationsReducer } from './ducks/applications'

const rootReducer = combineReducers({
  applications,
  paginatedApplications: paginatedApplicationsReducer
});

export default rootReducer;
