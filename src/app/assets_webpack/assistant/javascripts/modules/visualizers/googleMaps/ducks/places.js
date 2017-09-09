import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Place } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_PLACES = prefix('GET_PLACES');
export const GET_PLACES_SUCCESS = GET_PLACES + '_SUCCESS';
export const GET_PLACES_RESET = GET_PLACES + '_RESET';

export function getPlaces(urls, types, limit) {
  return withApplicationId(id => {
    const promise = api.getPlaces(id, urls, types, limit);
    return createAction(GET_PLACES, { promise });
  });
}

export function getPlacesReset() {
  return createAction(GET_PLACES_RESET);
}

// Reducer
const initialState = [];
export default function placesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_PLACES_RESET:
      return initialState;
    case GET_PLACES_SUCCESS:
      return action.payload.map(i => new Place(i));
  }
  return state;
};

// Selectors
export const placesStatusSelector = createPromiseStatusSelector(GET_PLACES);
export const placesSelector = createSelector([moduleSelector], state => state.places);