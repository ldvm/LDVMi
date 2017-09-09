import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { TimeRange } from '../models'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions
export const SET_TIME_RANGE = prefix('SET_TIME_RANGE');
export const SET_TIME_RANGE_RESET = SET_TIME_RANGE + '_RESET';

export function setTimeRange(begin, end) {
  return createAction(SET_TIME_RANGE, { begin, end });
}

export function setTimeRangeReset() {
  return createAction(SET_TIME_RANGE_RESET);
}

// Reducer
const initialState = new TimeRange();
export default function timeRangeReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_TIME_RANGE_RESET:
      return initialState;
    case SET_TIME_RANGE:
      return new TimeRange(action.payload);
    case GET_CONFIGURATION_SUCCESS:
      if ('timeRange' in action.payload) {
        return new TimeRange({
          begin: new Date(action.payload.timeRange.begin),
          end: new Date(action.payload.timeRange.end)
        });
      }
  }
  return state;
};

// Selectors
export const timeRangeSelector = createSelector([moduleSelector], state => state.timeRange);
