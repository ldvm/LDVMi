import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../app/ducks/dirty'
import { SET_SELECT_FL_PREDICATE, SET_SELECT_FL_PREDICATE_RESET } from './selectedFirstLevelPredicates'
import { SET_SELECT_FL_TYPE, SET_SELECT_FL_TYPE_RESET } from './selectedFirstLevelTypes'
import { SET_SELECT_SL_PREDICATE, SET_SELECT_SL_PREDICATE_RESET } from './selectedSecondLevelPredicates'
import { SET_SELECT_SL_THING, SET_SELECT_SL_THING_RESET } from './selectedSecondLevelThings'
import { SET_TIME_RANGE, SET_TIME_RANGE_RESET } from './timeRange'

// Reducer
const actions = [
  SET_SELECT_FL_PREDICATE,
  SET_SELECT_FL_PREDICATE_RESET,
  SET_SELECT_FL_TYPE,
  SET_SELECT_FL_TYPE_RESET,
  SET_SELECT_SL_PREDICATE,
  SET_SELECT_SL_PREDICATE_RESET,
  SET_SELECT_SL_THING,
  SET_SELECT_SL_THING_RESET,
  SET_TIME_RANGE,
  SET_TIME_RANGE_RESET
];

export default createDirtyReducer(actions);

// Selectors
export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
