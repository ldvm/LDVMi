import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { notification } from '../../../actions/notification'

export const RUN_EVALUATION_START = 'RUN_EVALUATION_START';
export const RUN_EVALUATION_ERROR = 'RUN_EVALUATION_ERROR';
export const RUN_EVALUATION_SUCCESS = 'RUN_EVALUATION_SUCCESS';

export function runEvaluation(pipelineId) {
  return dispatch => {
    const promise = api.runEvaluation(pipelineId)
      .then(message => dispatch(notification(message)))
      .catch(e => dispatch(notification(e.message)));
    dispatch(createAction('RUN_EVALUATION', { promise }));
  }
}

const initialState = null;

export default createPromiseReducer(initialState, [
  RUN_EVALUATION_START,
  RUN_EVALUATION_SUCCESS,
  RUN_EVALUATION_ERROR]);
