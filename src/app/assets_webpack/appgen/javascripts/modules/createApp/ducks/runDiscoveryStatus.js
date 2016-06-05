import { routeActions } from 'redux-simple-router'
import * as api from '../api'
import prefix from '../prefix'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { createPromiseStatusSelector } from '../../core/ducks/promises'

// Actions 

export const RUN_DISCOVERY = prefix('RUN_DISCOVERY');
export const RUN_DISCOVERY_START = prefix('RUN_DISCOVERY_START');
export const RUN_DISCOVERY_ERROR = prefix('RUN_DISCOVERY_ERROR');
export const RUN_DISCOVERY_SUCCESS = prefix('RUN_DISCOVERY_SUCCESS');

export function runDiscovery(userDataSourceIds) {
  return dispatch => {
    const promise = api.runDiscovery(userDataSourceIds)
      .then(userPipelineDiscoveryId =>
        dispatch(routeActions.push('/create-app/discovery/' + userPipelineDiscoveryId)));
    dispatch(createAction(RUN_DISCOVERY, { promise }));
  }
}

// Selectors

export const runDiscoveryStatusSelector = createPromiseStatusSelector(RUN_DISCOVERY);
