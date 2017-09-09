import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Connection } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_TSL = prefix('GET_THINGS_SECOND');
export const GET_TSL_SUCCESS = GET_TSL + '_SUCCESS';
export const GET_TSL_RESET = GET_TSL + '_RESET';

export function getSecondLevelInstants(things, thingTypes, connections, limit) {
  return withApplicationId(id => {
    const promise = api.getThingsWThingsWInstants(id, things, thingTypes, connections, limit);
    return createAction(GET_TSL, { promise });
  });
}

export function getSecondLevelIntervals(things, thingTypes, connections, limit) {
  return withApplicationId(id => {
    const promise = api.getThingsWThingsWIntervals(id, things, thingTypes, connections, limit);
    return createAction(GET_TSL, { promise });
  });
}

export function getSecondLevelReset() {
  return createAction(GET_TSL_RESET);
}

// Reducer
const initialState = [];
export default function secondLevelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_TSL_RESET:
      return initialState;
    case GET_TSL_SUCCESS:
      return action.payload.map(i => new Connection(i));
  }
  return state;
};

// Selectors
export const secondLevelStatusSelector = createPromiseStatusSelector(GET_TSL);
export const secondLevelSelector = createSelector([moduleSelector], state => state.secondLevel);