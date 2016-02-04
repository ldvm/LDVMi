import createAction from '../../../misc/createAction'
import * as api from '../api'
import {Record, List} from 'immutable';

export const EVALUATION_START = 'EVALUATION_START';
export const EVALUATION_FINISHED = 'EVALUATION_FINISHED';
export const EVALUATION_MESSAGE = 'EVALUATION_MESSAGE';
export const EVALUATION_ERROR = 'EVALUATION_ERROR';

export function runEvaluation(pipelineId) {
  // Create nice web socket middleware, maybe?
  return dispatch => {
    dispatch(createAction(EVALUATION_START));
    const socket = api.openEvaluationSocket(pipelineId);

    socket.onerror = error =>
      dispatch(createAction(EVALUATION_ERROR, error));

    socket.onclose = event =>
      dispatch(createAction(EVALUATION_FINISHED, event));

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      dispatch(createAction(EVALUATION_MESSAGE, data));

      // As the server does not close the socket itself, we have to do it manually. Closing the
      // socket this way will invoke 'onclose' event.
      if ('message' in data && data.message == '==== DONE ====') {
        socket.close();
      }
    }
  }
}

const InitialState = Record({
  isFinished: false,
  isSuccess: false,
  messages: new List(),
  errors: new List(),
  id: 0
});
const initialState = new InitialState;

export default function evaluationReducer(state = initialState, action) {
  // TODO: perhaps create a general reducer for web sockets? (something like pagination)
  switch (action.type) {
    case EVALUATION_START:
      // Reset the store contents
      return initialState;

    case EVALUATION_FINISHED:
      if (action.payload.wasClean === false) {
        return state.set('isFinished', true)
          .set('isSuccess', false)
          .update('errors', errors =>
            errors.push(action.payload.reason ?
            'Discovery was interrupted with the following error: ' + action.payload.reason :
              'Discovery failed with an unknown reason'));
      } else {
        return state
          .set('isFinished', true)
          .set('isSuccess', true); // TODO: come up with an actual way to detect success/error
      }

    case EVALUATION_ERROR:
      // Unfortunately web sockets API doesn't provide any way to get an error.
      return state.update('errors', errors =>
        errors.push('There was an error when communicating over socket'));

    case EVALUATION_MESSAGE:
      // Simple text message
      if ('message' in action.payload) {
        return state.update('messages', messages => messages.push(action.payload.message));
      }

      // More complex control message
      else if ('isFinished' in action.payload) { //
        return state
          .set('isFinished', !!action.payload.isFinished)
          .set('isSuccess', !!action.payload.isSuccess)
          .update('messages', messages => messages.push(action.payload.message));
      }
  }

  return state;
}
