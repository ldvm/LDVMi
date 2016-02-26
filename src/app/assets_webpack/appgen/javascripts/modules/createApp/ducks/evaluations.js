import { createSelector } from 'reselect'
import { fromJS, List } from 'immutable'
import * as api from '../api'
import prefix from '../prefix'
import createPromiseReducer, { PRESERVE_STATE } from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { evaluationsSelector as reducerSelector } from '../selector'
import { Evaluation } from '../models'

// Actions

export const GET_EVALUATIONS_START = prefix('GET_EVALUATIONS_START');
export const GET_EVALUATIONS_ERROR = prefix('GET_EVALUATIONS_ERROR');
export const GET_EVALUATIONS_SUCCESS = prefix('GET_EVALUATIONS_SUCCESS');

export function getEvaluations(userPipelineDiscoveryId) {
  const promise = api.getEvaluations(userPipelineDiscoveryId);
  return createAction(prefix('GET_EVALUATIONS'), { promise });
}
// Reducer

const initialState = List();

const reducer = (state, action) => {
  switch (action.type) {
    case GET_EVALUATIONS_SUCCESS:
      // Update the local state only if the incoming state is different.
      const newState = fromJS(action.payload);
      return state.equals(newState) ? state : newState;
  }

  return state;
};

export default createPromiseReducer(initialState, [
  GET_EVALUATIONS_START,
  GET_EVALUATIONS_ERROR,
  GET_EVALUATIONS_SUCCESS], reducer, PRESERVE_STATE);

// Selectors

export const promiseSelector = createSelector(
  [reducerSelector], ({ error, isLoading }) => ({ error, isLoading })
);

const dataSelector = createSelector(
  [reducerSelector], ({ data }) => data
);

export const evaluationsSelector = createSelector(
  [dataSelector], evaluations =>
    evaluations.map(evaluation => new Evaluation(evaluation))
);
