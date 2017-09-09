import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions
export const SET_SELECT_PLACE_TYPES = prefix('SET_SELECT_PLACE_TYPES');
export const SET_SELECT_PLACE_TYPES_RESET = SET_SELECT_PLACE_TYPES + '_RESET';

export function setSelectPlaceType(url) {
  return withApplicationId(id => {
    return createAction(SET_SELECT_PLACE_TYPES, { url });
  });
}

export function setSelectedPlaceTypesReset() {
  return createAction(SET_SELECT_PLACE_TYPES_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedPlaceTypesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_SELECT_PLACE_TYPES_RESET:
      return initialState;
    case SET_SELECT_PLACE_TYPES:
      return state.contains(action.payload.url) ? state.remove(action.payload.url) : state.add(action.payload.url);
    case GET_CONFIGURATION_SUCCESS:
      if ('selectedPlaceTypes' in action.payload) {
        return state.union(action.payload.selectedPlaceTypes);
      }
  }
  return state;
};

// Selectors
export const selectedPlaceTypesSelector = createSelector([moduleSelector], state => state.selectedPlaceTypes);