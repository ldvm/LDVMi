import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Interval } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_INTERVALS = prefix('GET_INTERVALS');
export const GET_INTERVALS_SUCCESS = GET_INTERVALS + '_SUCCESS';
export const GET_INTERVALS_RESET = GET_INTERVALS + '_RESET';

export function getIntervals(urls, start, end, limit) {
  return withApplicationId(id => {
    const promise = api.getIntervals(id, urls, start, end, limit);
    return createAction(GET_INTERVALS, { promise });
  });
}

export function getIntervalsReset() {
  return createAction(GET_INTERVALS_RESET);
}

// Reducer
const initialState = [];
export default function intervalsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_INTERVALS_RESET:
      return initialState;
    case GET_INTERVALS_SUCCESS:
      return action.payload.map(i => new Interval(i));
  }
  return state;
};

// Selectors
export const intervalsStatusSelector = createPromiseStatusSelector(GET_INTERVALS);
export const intervalsSelector = createSelector([moduleSelector], state => state.intervals);
