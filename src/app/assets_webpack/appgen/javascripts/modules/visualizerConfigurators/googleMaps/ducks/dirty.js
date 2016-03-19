import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { CONFIGURE_FILTER } from './filtersConfig'
import { CONFIGURE_OPTION, CONFIGURE_ALL_OPTIONS } from './optionsConfig'
import { UPDATE_PUBLISH_SETTINGS } from './publishSettings'
import { UPDATE_MAP_STATE } from './mapState'
import { SAVE_CONFIGURATION_START, SAVE_CONFIGURATION_ERROR } from './configuration'

// Reducer

export default function dirtyReducer(state = false, action) {
  switch (action.type) {
    case CONFIGURE_FILTER:
    case CONFIGURE_OPTION:
    case CONFIGURE_ALL_OPTIONS:
    case UPDATE_PUBLISH_SETTINGS:
    case UPDATE_MAP_STATE:
    case SAVE_CONFIGURATION_ERROR:
      return true;

    // We need to use the START event, not the SUCCESS, as the START event marks the snapshot
    // that has been sent to the server. Any changes that might occur after (but before
    // the request is finished) have to be saved separately using another request.
    case SAVE_CONFIGURATION_START:
      return false;
  }

  return state;
}

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
