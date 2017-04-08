import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../app/ducks/dirty'
import { GET_SELECTED_EVENT, GET_SELECTED_EVENT_RESET } from './selectedEvent'
import { GET_SETTINGS, GET_SETTINGS_RESET} from './settings'

// Reducer
const actions = [ GET_SETTINGS, GET_SETTINGS_RESET, GET_SELECTED_EVENT, GET_SELECTED_EVENT_RESET];

export default createDirtyReducer(actions);

// Selectors
export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
