import createAction from '../../misc/createAction'
import * as api from './api'

export const DISCOVERY_START = 'DISCOVERY_START';
export const DISCOVERY_FINISHED = 'DISCOVERY_FINISHED';
export const DISCOVERY_MESSAGE = 'DISCOVERY_MESSAGE';
export const DISCOVERY_ERROR = 'DISCOVERY_ERROR';

export function runDiscovery(dataSourceTemplateIds) {
  // Create nice web socket middleware, maybe?
  return dispatch => {
    dispatch(createAction(DISCOVERY_START));
    const socket = api.openDiscoverySocket(dataSourceTemplateIds);

    socket.onerror = error =>
      dispatch(createAction(DISCOVERY_ERROR, error));

    socket.onclose = event =>
      dispatch(createAction(DISCOVERY_FINISHED, event));

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      dispatch(createAction(DISCOVERY_MESSAGE, data));

      // As the server does not close the socket itself, we have to do it manually. Closing the
      // socket this way will invoke 'onclose' event.
      if ('isFinished' in data && data.isFinished) {
        socket.close();
      }
    }
  };
}

export const GET_PIPELINES_START = 'GET_PIPELINES_START';
export const GET_PIPELINES_ERROR = 'GET_PIPELINES_ERROR';
export const GET_PIPELINES_SUCCESS = 'GET_PIPELINES_SUCCESS';

export function getPipelines(discoveryId) {
  const promise = api.getPipelines(discoveryId);
  return createAction('GET_PIPELINES', {promise, data: {discoveryId}});
}
