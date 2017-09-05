import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Instant } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_INSTANTS = prefix('GET_INSTANTS');
export const GET_INSTANTS_SUCCESS = GET_INSTANTS + '_SUCCESS';
export const GET_INSTANTS_RESET = GET_INSTANTS + '_RESET';

export function getInstants(urls, start, end, limit) {
  return withApplicationId(id => {
    const promise = api.getInstants(id, urls, start, end, limit);
    return createAction(GET_INSTANTS, { promise });
  });
}

export function getInstantsReset() {
  return createAction(GET_INSTANTS_RESET);
}

// Reducer
const initialState = [];
export default function instantsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case GET_INSTANTS_RESET:
      return initialState;
    case GET_INSTANTS_SUCCESS:
      return action.payload.map(i => new Instant(i));
  }
  return state;
};

// Selectors
export const instantsStatusSelector = createPromiseStatusSelector(GET_INSTANTS);
export const instantsSelector = createSelector([moduleSelector], state => state.instants);