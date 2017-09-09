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
export const GET_TFL = prefix('GET_THINGS_FIRST');
export const GET_TFL_SUCCESS = GET_TFL + '_SUCCESS';
export const GET_TFL_RESET = GET_TFL + '_RESET';

export function getFirstLevelIntervals(things, thingTypes, connections, limit) {
  return withApplicationId(id => {
    const promise = api.getThingsWIntervals(id, things, thingTypes, connections, limit);
    return createAction(GET_TFL, { promise });
  });
}

export function getFirstLevelInstants(things, thingTypes, connections, limit) {
  return withApplicationId(id => {
    const promise = api.getThingsWInstants(id, things, thingTypes, connections, limit);
    return createAction(GET_TFL, { promise });
  });
}

export function getFirstLevelReset() {
  return createAction(GET_TFL_RESET);
}

// Reducer
const initialState = [];
export default function firstLevelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_TFL_RESET:
      return initialState;
    case GET_TFL_SUCCESS:
      return action.payload.map(i => new Connection(i));
  }
  return state;
};

// Selectors
export const firstLevelStatusSelector = createPromiseStatusSelector(GET_TFL);
export const firstLevelSelector = createSelector([moduleSelector], state => state.firstLevel);