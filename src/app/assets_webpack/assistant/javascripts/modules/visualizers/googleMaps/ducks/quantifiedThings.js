import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { QuantifiedThing } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_QUANTIFIED_THINGS = prefix('GET_QUANTIFIED_THINGS');
export const GET_QUANTIFIED_THINGS_SUCCESS = GET_QUANTIFIED_THINGS + '_SUCCESS';
export const GET_QUANTIFIED_THINGS_RESET = GET_QUANTIFIED_THINGS + '_RESET';

export function getQuantifiedThings(urls, valueConnections, placeConnections, limit) {
  return withApplicationId(id => {
    const promise = api.getQuantifiedThings(id, urls, valueConnections, placeConnections, limit);
    return createAction(GET_QUANTIFIED_THINGS, { promise });
  });
}

export function getQuantifiedThingsReset() {
  return createAction(GET_QUANTIFIED_THINGS_RESET);
}

// Reducer
const initialState = [];
export default function quantifiedThingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_QUANTIFIED_THINGS_RESET:
      return initialState;
    case GET_QUANTIFIED_THINGS_SUCCESS:
      return action.payload.map(i => new QuantifiedThing(i));
  }
  return state;
};

// Selectors
export const quantifiedThingsStatusSelector = createPromiseStatusSelector(GET_QUANTIFIED_THINGS);
export const quantifiedThingsSelector = createSelector([moduleSelector], state => state.quantifiedThings);