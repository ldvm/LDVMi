import { GET_PIPELINES_START, GET_PIPELINES_ERROR, GET_PIPELINES_SUCCESS } from './actions';
import {Record, List} from 'immutable';

const InitialState = Record({
  discoveryId: 0,
  error: "",
  isLoading: false,
  pipelines: new List()
});
const initialState = new InitialState;

export default function pipelinesReducer(state = initialState, action) {

  switch (action.type) {
    case GET_PIPELINES_START:
      return initialState
        .set('isLoading', true)
        .set('discoveryId', action.payload.discoveryId);

    case GET_PIPELINES_ERROR:
      return state
        .set('isLoading', false)
        .set('error', action.payload.message);

    case GET_PIPELINES_SUCCESS:
      return state
        .set('isLoading', false)
        .set('pipelines', new List(action.payload));
  }

  return state;
}
