import createAction from '../../../misc/createAction'
import * as api from '../api'
import {Record, List} from 'immutable';

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

const InitialState = Record({
  isFinished: false,
  isSuccess: false,
  pipelinesDiscoveredCount: 0,
  messages: new List(),
  errors: new List(),
  id: 0
});
const initialState = new InitialState;

export default function discoveryReducer(state = initialState, action) {
  // TODO: perhaps create a general reducer for web sockets? (something like pagination)
  switch (action.type) {
    case DISCOVERY_START:
      // Reset the store contents
      return initialState;

    case DISCOVERY_FINISHED:
      if (action.payload.wasClean === false) {
        return state.set('isFinished', true)
          .set('isSuccess', false)
          .update('errors', errors =>
            errors.push(action.payload.reason ?
            'Discovery was interrupted with the following error: ' + action.payload.reason :
              'Discovery failed with an unknown reason'));

      } else {
        return state.set('isFinished', true);
      }

    case DISCOVERY_ERROR:
      // Unfortunately web sockets API doesn't provide any way to get an error.
      return state.update('errors', errors =>
        errors.push('There was an error when communicating over socket'));

    case DISCOVERY_MESSAGE:
      // Simple text message
      if ('message' in action.payload) {
        return state.update('messages', messages => messages.push(action.payload.message));
      }

      // More complex control message
      else if ('isFinished' in action.payload) { //
        return state
          .set('isFinished', !!action.payload.isFinished)
          .set('isSuccess', !!action.payload.isSuccess)
          .set('id', action.payload.id)
          .update('pipelinesDiscoveredCount', count =>
            'pipelinesDiscoveredCount' in action.payload ?
              action.payload.pipelinesDiscoveredCount : count);
      }
  }

  return state;
}
