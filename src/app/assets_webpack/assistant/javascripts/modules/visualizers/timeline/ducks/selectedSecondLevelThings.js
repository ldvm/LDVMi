import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions
export const SET_SELECT_SL_THING = prefix('SET_SELECT_SECOND_LEVEL_THING');
export const SET_SELECT_SL_THING_RESET = SET_SELECT_SL_THING + '_RESET';

export function setSelectThingSL(key) {
  return createAction(SET_SELECT_SL_THING, { key });
}

export function setSelectedSecondLevelThingsReset() {
  return createAction(SET_SELECT_SL_THING_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedSecondLevelThingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_SELECT_SL_THING_RESET:
      return initialState;
    case SET_SELECT_SL_THING:
      return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    case GET_CONFIGURATION_SUCCESS:
      if ('selectedSecondLevelThings' in action.payload) {
        return state.union(action.payload.selectedSecondLevelThings);
      }
  }
  return state;
};

// Selectors
export const selectedSecondLevelThingsSelector = createSelector([moduleSelector], state => state.selectedSecondLevelThings);
