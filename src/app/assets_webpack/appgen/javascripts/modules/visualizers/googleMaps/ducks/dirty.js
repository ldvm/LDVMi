import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../manageApp/ducks/dirty'
import { CONFIGURE_FILTER } from './filtersConfig'
import { CONFIGURE_OPTION, CONFIGURE_ALL_OPTIONS } from './optionsConfig'
import { UPDATE_PUBLISH_SETTINGS } from './publishSettings'
import { UPDATE_MAP_STATE } from './mapState'

// Reducer

const actions = [
  CONFIGURE_FILTER,
  CONFIGURE_OPTION,
  CONFIGURE_ALL_OPTIONS,
  UPDATE_PUBLISH_SETTINGS,
  UPDATE_MAP_STATE
];

export default createDirtyReducer(actions);

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
