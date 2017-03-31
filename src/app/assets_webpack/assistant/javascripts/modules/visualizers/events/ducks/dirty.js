import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../app/ducks/dirty'
import {SELECT_EVENT} from "./selectedEvents";

// Reducer
const actions = [
    SELECT_EVENT
];

export default createDirtyReducer(actions);

// Selectors
export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
