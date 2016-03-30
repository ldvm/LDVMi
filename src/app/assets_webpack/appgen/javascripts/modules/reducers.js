import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import createAppReducer from './createApp/reducer'
import manageAppReducer from './manageApp/reducer'
import coreReducer from './core/reducer'
import visualizersReducer from './visualizers/reducer'

export default {
  auth: authReducer,
  core: coreReducer,
  createApp: createAppReducer,
  manageApp: manageAppReducer,
  visualizers: visualizersReducer
};
