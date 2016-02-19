import { createSelector } from 'reselect'
import { fromJS, Map, List } from 'immutable'
import * as api from '../api'
import createPromiseReducer, { PRESERVE_STATE } from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { discoverySelector as reducerSelector } from '../selector'
import { Discovery, Pipeline } from '../models'

// Actions

export const GET_DISCOVERY_START = 'GET_DISCOVERY_START';
export const GET_DISCOVERY_ERROR = 'GET_DISCOVERY_ERROR';
export const GET_DISCOVERY_SUCCESS = 'GET_DISCOVERY_SUCCESS';

export function getDiscovery(userPipelineDiscoveryId) {
  const promise = api.getDiscovery(userPipelineDiscoveryId);
  return createAction('GET_DISCOVERY', { promise });
}

// Reducer

const initialState = Map();

const reducer = (state, action) => {
  switch (action.type) {
    case GET_DISCOVERY_SUCCESS:
      // Update the local state only if the incoming state is different.
      const newState = fromJS(action.payload);
      return state.equals(newState) ? state : newState;
  }

  return state;
};

export default createPromiseReducer(initialState, [
  GET_DISCOVERY_START,
  GET_DISCOVERY_SUCCESS,
  GET_DISCOVERY_ERROR], reducer, PRESERVE_STATE);

// Selectors

const promiseSelector = createSelector(
  [reducerSelector], ({ error, isLoading }) => ({ error, isLoading })
);

const dataSelector = createSelector(
  [reducerSelector], ({ data }) => data
);

const mergedDiscoverySelector = createSelector(
  [dataSelector],
  data => data.has('pipelineDiscovery') && data.has('userPipelineDiscovery') ?
    // Careful here, order of merging is important because both objects contain an id property.
    new Discovery(data.get('pipelineDiscovery').merge(data.get('userPipelineDiscovery'))) : null
);

const pipelinesSelector = createSelector(
  [dataSelector],
  data => data.has('pipelines') ?
    data.get('pipelines').map(pipeline => new Pipeline(pipeline)) : List()
);

// This rather complex hierarchy of selectors makes sure that the memoization works correctly.
export const discoverySelector = createSelector(
  [promiseSelector, mergedDiscoverySelector, pipelinesSelector],
  ({error, isLoading}, discovery, pipelines) => ({
    error, isLoading, discovery, pipelines
  })
);
