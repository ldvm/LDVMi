import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { CONFIGURE_FILTER } from './filtersConfig'
import { CONFIGURE_OPTION, CONFIGURE_ALL_OPTIONS } from './optionsConfig'
import { UPDATE_PUBLISH_SETTINGS } from './publishSettings'
import { UPDATE_MAP_STATE } from './mapState'

// Reducer

export default function dirtyReducer(state = false, action) {
  switch (action.type) {
    case CONFIGURE_FILTER:
    case CONFIGURE_OPTION:
    case CONFIGURE_ALL_OPTIONS:
    case UPDATE_PUBLISH_SETTINGS:
    case UPDATE_MAP_STATE:
      return true;
  }

  return state;
}

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
