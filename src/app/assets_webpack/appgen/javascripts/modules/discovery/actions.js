import createAction from '../../misc/createAction'
import { openDiscoverySocket} from './api'

export const DISCOVERY_START = 'DISCOVERY_START';
export const DISCOVERY_FINISHED = 'DISCOVERY_FINISHED';
export const DISCOVERY_MESSAGE = 'DISCOVERY_MESSAGE';
export const DISCOVERY_ERROR = 'DISCOVERY_ERROR';

export function runDiscovery(dataSourceTemplateIds) {
  // Create nice web socket middleware, maybe?
  return dispatch => {
    dispatch(createAction(DISCOVERY_START));
    const socket = openDiscoverySocket(dataSourceTemplateIds);

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
