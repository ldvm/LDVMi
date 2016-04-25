import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { SAVE_CONFIGURATION_START, SAVE_CONFIGURATION_ERROR, GET_CONFIGURATION_SUCCESS } from './configuration'
import { GET_APPLICATION_START } from '../../../manageApp/ducks/application'
import { ADD_LIST, REMOVE_LIST, UPDATE_LIST, ADD_TO_LIST, ADD_WITH_RELATED_TO_LIST_SUCCESS, REMOVE_FROM_LIST, REMOVE_WITH_RELATED_FROM_LIST_SUCCESS, SELECT_NODE } from './lists'
import { SELECT_LIST } from './selectedList'
import { UPDATE_PUBLISH_SETTINGS } from './publishSettings'

// Reducer

export default function dirtyReducer(state = false, action) {
  switch (action.type) {
    case ADD_LIST:
    case REMOVE_LIST:
    case UPDATE_LIST:
    case ADD_TO_LIST:
    case ADD_WITH_RELATED_TO_LIST_SUCCESS:
    case REMOVE_FROM_LIST:
    case REMOVE_WITH_RELATED_FROM_LIST_SUCCESS:
    case SELECT_NODE:
    case SELECT_LIST:
    case UPDATE_PUBLISH_SETTINGS:
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

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
