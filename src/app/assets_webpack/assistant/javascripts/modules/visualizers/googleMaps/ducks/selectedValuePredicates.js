import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions
export const SET_SELECT_VALUE_PREDICATES = prefix('SET_SELECT_VALUE_PREDICATES');
export const SET_SELECT_VALUE_PREDICATES_RESET = SET_SELECT_VALUE_PREDICATES + '_RESET';

export function setSelectValuePredicate(url) {
  return withApplicationId(id => {
    return createAction(SET_SELECT_VALUE_PREDICATES, { url });
  });
}

export function setSelectedValuePredicatesReset() {
  return createAction(SET_SELECT_VALUE_PREDICATES_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedValuePredicatesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_SELECT_VALUE_PREDICATES_RESET:
      return initialState;
    case SET_SELECT_VALUE_PREDICATES:
      return state.contains(action.payload.url) ? state.remove(action.payload.url) : state.add(action.payload.url);
    case GET_CONFIGURATION_SUCCESS:
      if ('selectedValuePredicates' in action.payload) {
        return state.union(action.payload.selectedValuePredicates);
      }
  }
  return state;
};

// Selectors
export const selectedValuePredicatesSelector = createSelector([moduleSelector], state => state.selectedValuePredicates);