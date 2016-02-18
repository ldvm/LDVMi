import { fromJS, Map } from 'immutable'
import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'

export const GET_DISCOVERY_START = 'GET_DISCOVERY_START';
export const GET_DISCOVERY_ERROR = 'GET_DISCOVERY_ERROR';
export const GET_DISCOVERY_SUCCESS = 'GET_DISCOVERY_SUCCESS';

// Actions

export function getDiscovery(userPipelineDiscoveryId) {
  const promise = api.getDiscovery(userPipelineDiscoveryId);
  return createAction('GET_DISCOVERY', {promise});
}
