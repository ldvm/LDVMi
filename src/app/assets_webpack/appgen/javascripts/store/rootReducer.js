import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import { reducer as formReducer } from 'redux-form';
import loadingReducer from '../reducers/loading'
import notificationsReducer from '../reducers/notifications'
import authReducer from '../modules/auth/reducer'
import createAppReducer from '../modules/createApp/reducer'
import manageAppReducer from '../modules/manageApp/reducer'
import coreReducer from '../modules/core/reducer'
import visualizerConfiguratorsReducer from '../modules/visualizerConfigurators/reducer'

export default combineReducers({
  routing: routeReducer,
  form: formReducer,
  loading: loadingReducer,
  notifications: notificationsReducer,
  auth: authReducer,
  core: coreReducer,
  createApp: createAppReducer,
  manageApp: manageAppReducer,
  visualizerConfigurators: visualizerConfiguratorsReducer
});
