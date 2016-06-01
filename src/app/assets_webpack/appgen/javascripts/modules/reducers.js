import authReducer from './auth/reducer'
import createAppReducer from './createApp/reducer'
import appReducer from './app/reducer'
import coreReducer from './core/reducer'
import visualizersReducer from './visualizers/reducer'
import platformReducer from './platform/reducer'
import dashboardReducer from './dashboard/reducer'

export default {
  auth: authReducer,
  core: coreReducer,
  platform: platformReducer,
  dashboard: dashboardReducer,
  createApp: createAppReducer,
  app: appReducer,
  visualizers: visualizersReducer
};
