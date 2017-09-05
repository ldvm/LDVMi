import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { Counts } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions
export const GET_COORDINATES_COUNT = prefix('GET_COORDINATES_COUNT');
export const GET_COORDINATES_COUNT_SUCCESS = GET_COORDINATES_COUNT + '_SUCCESS';
export function getCoordinatesCount(urls) {
  return withApplicationId(id => {
    const promise = api.getCoordinatesCount(id, urls);
    return createAction(GET_COORDINATES_COUNT, { promise });
  });
}

export const GET_PLACES_COUNT = prefix('GET_PLACES_COUNT');
export const GET_PLACES_COUNT_SUCCESS = GET_PLACES_COUNT + '_SUCCESS';
export function getPlacesCount(urls, types) {
  return withApplicationId(id => {
    const promise = api.getPlacesCount(id, urls, types);
    return createAction(GET_PLACES_COUNT, { promise });
  });
}

export const GET_QUANTIFIED_THINGS_COUNT = prefix('GET_QUANTIFIED_THINGS_COUNT');
export const GET_QUANTIFIED_THINGS_COUNT_SUCCESS = GET_QUANTIFIED_THINGS_COUNT + '_SUCCESS';
export function getQuantifiedThingsCount(urls, valueConnections, placeConnections) {
  return withApplicationId(id => {
    const promise = api.getQuantifiedThingsCount(id, urls, valueConnections, placeConnections);
    return createAction(GET_QUANTIFIED_THINGS_COUNT, { promise });
  });
}

export const GET_QUANTIFIED_PLACES_COUNT = prefix('GET_QUANTIFIED_PLACES_COUNT');
export const GET_QUANTIFIED_PLACES_COUNT_SUCCESS = GET_QUANTIFIED_PLACES_COUNT + '_SUCCESS';
export function getQuantifiedPlacesCount(urls, types, valueConnections) {
  return withApplicationId(id => {
    const promise = api.getQuantifiedPlacesCount(id, urls, types, valueConnections);
    return createAction(GET_QUANTIFIED_PLACES_COUNT, { promise });
  });
}

export const GET_COUNTS_RESET = prefix('GET_COUNTS_RESET');
export function getCountsReset() {
  return createAction(GET_COUNTS_RESET);
}

// Reducer
const initialState = new Counts();
export default function countReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_COUNTS_RESET:
      return initialState;
    case GET_COORDINATES_COUNT_SUCCESS:
      return new Counts({
        coordinates: action.payload.value,
        places: state.places,
        quantifiedThings: state.quantifiedThings,
        quantifiedPlaces: state.quantifiedPlaces
      });
    case GET_PLACES_COUNT_SUCCESS:
      return new Counts({
        coordinates: state.coordinates,
        places: action.payload.value,
        quantifiedThings: state.quantifiedThings,
        quantifiedPlaces: state.quantifiedPlaces
      });
    case GET_QUANTIFIED_THINGS_COUNT_SUCCESS:
      return new Counts({
        coordinates: state.coordinates,
        places: state.places,
        quantifiedThings: action.payload.value,
        quantifiedPlaces: state.quantifiedPlaces
      });
    case GET_QUANTIFIED_PLACES_COUNT_SUCCESS:
      return new Counts({
        coordinates: state.coordinates,
        places: state.places,
        quantifiedThings: state.quantifiedThings,
        quantifiedPlaces: action.payload.value
      });
  }
  return state;
};

// Selectors
export const coordinatesCountStatusSelector = createPromiseStatusSelector(GET_COORDINATES_COUNT);
export const coordinatesCountSelector = createSelector([moduleSelector], state => state.count.coordinates);

export const placesCountStatusSelector = createPromiseStatusSelector(GET_PLACES_COUNT);
export const placesCountSelector = createSelector([moduleSelector], state => state.count.places);

export const quantifiedThingsCountStatusSelector = createPromiseStatusSelector(GET_QUANTIFIED_THINGS_COUNT);
export const quantifiedThingsCountSelector = createSelector([moduleSelector], state => state.count.quantifiedThings);

export const quantifiedPlacesCountStatusSelector = createPromiseStatusSelector(GET_QUANTIFIED_PLACES_COUNT);
export const quantifiedPlacesCountSelector = createSelector([moduleSelector], state => state.count.quantifiedPlaces);