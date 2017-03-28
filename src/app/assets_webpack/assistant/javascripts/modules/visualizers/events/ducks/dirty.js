import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../app/ducks/dirty'

// Reducer
const actions = [ ];

export default createDirtyReducer(actions);

// Selectors
export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
