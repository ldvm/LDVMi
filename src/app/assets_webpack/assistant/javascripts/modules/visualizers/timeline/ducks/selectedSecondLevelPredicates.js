import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions
export const SET_SELECT_SL_PREDICATE = prefix('SET_SELECT_SECOND_LEVEL_PREDICATE');
export const SET_SELECT_SL_PREDICATE_RESET = SET_SELECT_SL_PREDICATE + '_RESET';

export function setSelectSecondLevelPredicate(key) {
  return createAction(SET_SELECT_SL_PREDICATE, { key });
}

export function setSelectedSecondLevelPredicatesReset() {
  return createAction(SET_SELECT_SL_PREDICATE_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedConnSLReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_SELECT_SL_PREDICATE_RESET:
      return initialState;
    case SET_SELECT_SL_PREDICATE:
      return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    case GET_CONFIGURATION_SUCCESS:
      if ('selectedSecondLevelPredicates' in action.payload) {
        return state.union(action.payload.selectedSecondLevelPredicates);
      }
  }
  return state;
};

// Selectors
export const selectedSecondLevelPredicatesSelector = createSelector([moduleSelector], state => state.selectedSecondLevelPredicates);