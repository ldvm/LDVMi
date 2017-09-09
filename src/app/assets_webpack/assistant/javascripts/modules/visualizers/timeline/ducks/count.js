import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Count } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// ===ACTIONS===

// Level 0 => instants & intervals
export const GET_COUNT_ZERO = prefix('GET_COUNT_ZERO');
export const GET_COUNT_ZERO_SUCCESS = GET_COUNT_ZERO + '_SUCCESS';

export function getIntervalsCount(urls, timeRange) {
  return withApplicationId(id => {
    const promise = api.getIntervalsCount(id, urls, timeRange);
    return createAction(GET_COUNT_ZERO, { promise });
  });
}

export function getInstantsCount(urls, timeRange) {
  return withApplicationId(id => {
    const promise = api.getInstantsCount(id, urls, timeRange);
    return createAction(GET_COUNT_ZERO, { promise });
  });
}

// Level 1 => Things with Instants / Intervals
export const GET_COUNT_FIRST = prefix('GET_COUNT_FIRST');
export const GET_COUNT_FIRST_SUCCESS = GET_COUNT_FIRST + '_SUCCESS';

export function getFirstLevelIntervalsCount(things, thingTypes, connections) {
  return withApplicationId(id => {
    const promise = api.getThingsWIntervalsCount(id, things, thingTypes, connections);
    return createAction(GET_COUNT_FIRST, { promise });
  });
}

export function getFirstLevelInstantsCount(things, thingTypes, connections) {
  return withApplicationId(id => {
    const promise = api.getThingsWInstantsCount(id, things, thingTypes, connections);
    return createAction(GET_COUNT_FIRST, { promise });
  });
}

// Level 2 => Things with Things with Instants / Intervals
export const GET_COUNT_SECOND = prefix('GET_COUNT_SECOND');
export const GET_COUNT_SECOND_SUCCESS = GET_COUNT_SECOND + '_SUCCESS';

export function getSecondLevelIntervalsCount(things, thingTypes, connections) {
  return withApplicationId(id => {
    const promise = api.getThingsWThingsWIntervalsCount(id, things, thingTypes, connections);
    return createAction(GET_COUNT_SECOND, { promise });
  });
}

export function getSecondLevelInstantsCount(things, thingTypes, connections) {
  return withApplicationId(id => {
    const promise = api.getThingsWThingsWInstantsCount(id, things, thingTypes, connections);
    return createAction(GET_COUNT_SECOND, { promise });
  });
}

export const GET_COUNT_RES = prefix('GET_COUNTS_RESET');
export function getCountReset() {
  debugger;
  return createAction(GET_COUNT_RES);
}

// ===REDUCERS===
const initialState = new Count();
export default function countReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_COUNT_RES:
      return initialState;
    case GET_COUNT_ZERO_SUCCESS:
      return new Count({ 'zero': action.payload.value, 'first': state.first, 'second': state.second });
    case GET_COUNT_FIRST_SUCCESS:
      return new Count({ 'zero': state.zero, 'first': action.payload.value, 'second': state.second });
    case GET_COUNT_SECOND_SUCCESS:
      return new Count({ 'zero': state.zero, 'first': state.first, 'second': action.payload.value });
  }
  return state;
};

// ===SELECTORS===

// Level 0
export const countZeroStatusSelector = createPromiseStatusSelector(GET_COUNT_ZERO);
export const countZeroSelector = createSelector([moduleSelector], state => state.count.zero);

// Level 1
export const countFirstStatusSelector = createPromiseStatusSelector(GET_COUNT_FIRST);
export const countFirstSelector = createSelector([moduleSelector], state => state.count.first);

// Level 2
export const countSecondStatusSelector = createPromiseStatusSelector(GET_COUNT_SECOND);
export const countSecondSelector = createSelector([moduleSelector], state => state.count.second);