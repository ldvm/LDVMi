import { routeActions } from 'redux-simple-router'
import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'

export const RUN_DISCOVERY_START = 'RUN_DISCOVERY_START';
export const RUN_DISCOVERY_ERROR = 'RUN_DISCOVERY_ERROR';
export const RUN_DISCOVERY_SUCCESS = 'RUN_DISCOVERY_SUCCESS';

export function runDiscovery(userDataSourceIds) {
  return dispatch => {
    const promise = api.runDiscovery(userDataSourceIds)
      .then(userPipelineDiscoveryId =>
        dispatch(routeActions.push('/create-app/discovery/' + userPipelineDiscoveryId)));
    dispatch(createAction('RUN_DISCOVERY', { promise }));
  }
}

const initialState = null;

export default createPromiseReducer(initialState, [
  RUN_DISCOVERY_START,
  RUN_DISCOVERY_SUCCESS,
  RUN_DISCOVERY_ERROR]);
