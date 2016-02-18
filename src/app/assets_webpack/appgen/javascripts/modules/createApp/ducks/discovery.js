import { fromJS, Map } from 'immutable'
import * as api from '../api'
import createPromiseReducer, { PRESERVE_STATE } from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'

export const GET_DISCOVERY_START = 'GET_DISCOVERY_START';
export const GET_DISCOVERY_ERROR = 'GET_DISCOVERY_ERROR';
export const GET_DISCOVERY_SUCCESS = 'GET_DISCOVERY_SUCCESS';

// Actions

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
