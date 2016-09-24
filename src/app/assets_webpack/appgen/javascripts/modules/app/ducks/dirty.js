import { GET_APPLICATION_START } from './application'
import { SAVE_CONFIGURATION_START, SAVE_CONFIGURATION_ERROR, GET_CONFIGURATION_SUCCESS } from './configuration'
import { UPDATE_CUSTOM_LABEL } from './customLabels'

export function createDirtyReducer(actions) {
  return function dirtyReducer(state = false, action) {
    // Custom actions provided by visualizer
    if (actions.indexOf(action.type) !== -1)  {
      return true;
    }
    
    switch (action.type) {
      case UPDATE_CUSTOM_LABEL:
      case SAVE_CONFIGURATION_ERROR:
        return true;

      // We need to use the START event, not the SUCCESS, as the START event marks the snapshot
      // that has been sent to the server. Any changes that might occur after (but before
      // the request is finished) have to be saved separately using another request.
      case SAVE_CONFIGURATION_START:
      case GET_APPLICATION_START:
      case GET_CONFIGURATION_SUCCESS:
        return false;
    }

    return state;
  }
}