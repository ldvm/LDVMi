import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { FullCoordinates } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_COORDINATES = prefix('GET_COORDINATES');
export const GET_COORDINATES_SUCCESS = GET_COORDINATES + '_SUCCESS';
export const GET_COORDINATES_RESET = GET_COORDINATES + '_RESET';

export function getCoordinates(urls, limit) {
  return withApplicationId(id => {
    const promise = api.getCoordinates(id, urls, limit);
    return createAction(GET_COORDINATES, { promise });
  });
}

export function getCoordinatesReset() {
  return createAction(GET_COORDINATES_RESET);
}

// Reducer
const initialState = [];
export default function coordinatesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_COORDINATES_RESET:
      return initialState;
    case GET_COORDINATES_SUCCESS:
      return action.payload.map(i => new FullCoordinates(i));
  }
  return state;
};

// Selectors
export const coordinatesStatusSelector = createPromiseStatusSelector(GET_COORDINATES);
export const coordinatesSelector = createSelector([moduleSelector], state => state.coordinates);