import { GET_APPLICATION_START } from './application'
import { GET_CONFIGURATION_SUCCESS, SAVE_CONFIGURATION_ERROR, SAVE_CONFIGURATION_START } from './configuration'
import { UPDATE_CUSTOM_LABEL } from './customLabels'
import { SET_LIMIT, SET_LIMIT_RESET } from './limit'

export function createDirtyReducer(actions) {
  return function dirtyReducer(state = false, action) {
    // Custom actions provided by visualizer
    if (actions.indexOf(action.type) !== -1) {
      return true;
    }

    switch (action.type) {
      case UPDATE_CUSTOM_LABEL:
      case SAVE_CONFIGURATION_ERROR:
      case SET_LIMIT:
      case SET_LIMIT_RESET:
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