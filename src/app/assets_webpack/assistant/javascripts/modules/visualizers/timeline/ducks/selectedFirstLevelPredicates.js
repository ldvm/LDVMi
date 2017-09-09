import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions
export const SET_SELECT_FL_PREDICATE = prefix('SET_SELECT_FIRST_LEVEL_PREDICATE');
export const SET_SELECT_FL_PREDICATE_RESET = SET_SELECT_FL_PREDICATE + '_RESET';

export function setSelectFirstLevelPredicate(key) {
  return createAction(SET_SELECT_FL_PREDICATE, { key });
}

export function setSelectedFirstLevelPredicatesReset() {
  return createAction(SET_SELECT_FL_PREDICATE_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedConnFLReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_SELECT_FL_PREDICATE_RESET:
      return initialState;
    case SET_SELECT_FL_PREDICATE:
      return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    case GET_CONFIGURATION_SUCCESS:
      if ('selectedFirstLevelPredicates' in action.payload) {
        return state.union(action.payload.selectedFirstLevelPredicates);
      }
  }
  return state;
};

// Selectors
export const selectedFirstLevelPredicatesSelector = createSelector([moduleSelector], state => state.selectedFirstLevelPredicates);