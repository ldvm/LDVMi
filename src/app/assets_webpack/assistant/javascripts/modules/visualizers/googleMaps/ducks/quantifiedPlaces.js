import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { QuantifiedPlace } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_QUANTIFIED_PLACES = prefix('GET_QUANTIFIED_PLACES');
export const GET_QUANTIFIED_PLACES_SUCCESS = GET_QUANTIFIED_PLACES + '_SUCCESS';
export const GET_QUANTIFIED_PLACES_RESET = GET_QUANTIFIED_PLACES + '_RESET';

export function getQuantifiedPlaces(urls, placeTypes, valueConnections, limit) {
  return withApplicationId(id => {
    const promise = api.getQuantifiedPlaces(id, urls, placeTypes, valueConnections, limit);
    return createAction(GET_QUANTIFIED_PLACES, { promise });
  });
}

export function getQuantifiedPlacesReset() {
  return createAction(GET_QUANTIFIED_PLACES_RESET);
}

// Reducer
const initialState = [];
export default function quantifiedPlacesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_QUANTIFIED_PLACES_RESET:
      return initialState;
    case GET_QUANTIFIED_PLACES_SUCCESS:
      return action.payload.map(i => new QuantifiedPlace(i));
  }
  return state;
};

// Selectors
export const quantifiedPlacesStatusSelector = createPromiseStatusSelector(GET_QUANTIFIED_PLACES);
export const quantifiedPlacesSelector = createSelector([moduleSelector], state => state.quantifiedPlaces);