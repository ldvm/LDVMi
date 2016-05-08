import authReducer from './auth/reducer'
import createAppReducer from './createApp/reducer'
import manageAppReducer from './manageApp/reducer'
import coreReducer from './core/reducer'
import visualizersReducer from './visualizers/reducer'
import platformReducer from './platform/reducer'

export default {
  auth: authReducer,
  core: coreReducer,
  platform: platformReducer,
  createApp: createAppReducer,
  manageApp: manageAppReducer,
  visualizers: visualizersReducer
};
