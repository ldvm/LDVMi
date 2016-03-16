import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import { reducer as formReducer } from 'redux-form';
import loadingReducer from '../reducers/loading'
import notificationsReducer from '../reducers/notifications'
import authReducer from '../modules/auth/reducer'
import dialogReducer from '../ducks/dialog'
import promisesReducer from '../ducks/promises'
import langReducer from '../ducks/lang'
import createAppReducer from '../modules/createApp/reducer'
import manageAppReducer from '../modules/manageApp/reducer'
import commonReducer from '../modules/common/reducer'
import visualizerConfiguratorsReducer from '../modules/visualizerConfigurators/reducer'

export default combineReducers({
  routing: routeReducer,
  form: formReducer,
  loading: loadingReducer,
  notifications: notificationsReducer,
  auth: authReducer,
  dialog: dialogReducer,
  promises: promisesReducer,
  lang: langReducer,
  common: commonReducer,
  createApp: createAppReducer,
  manageApp: manageAppReducer,
  visualizerConfigurators: visualizerConfiguratorsReducer
});
