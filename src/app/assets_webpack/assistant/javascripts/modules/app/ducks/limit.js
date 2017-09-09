import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from './application'
import { createSelector } from 'reselect'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

export const limit_default = 50;

// Actions
export const SET_LIMIT = prefix('SET_LIMIT');
export const SET_LIMIT_RESET = SET_LIMIT + '_RESET';

export function setLimit(limit) {
  return createAction(SET_LIMIT, { limit });
}

export function setLimitReset() {
  return createAction(SET_LIMIT_RESET);
}

// Reducer
const initialState = limit_default;
export default function limitReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_LIMIT_RESET:
      return initialState;
    case SET_LIMIT:
      return action.payload.limit;
    case GET_CONFIGURATION_SUCCESS:
      if ('limit' in action.payload) {
        return action.payload.limit;
      }
  }
  return state;
};

// Selectors
export const limitSelector = createSelector([moduleSelector], state => state.limit);