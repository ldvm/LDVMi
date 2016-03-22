import * as api from '../api'
import prefix from '../prefix'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import { notification } from '../../../actions/notification'
import { getEvaluations } from './evaluations'

// Actions

const RUN_EVALUATION = prefix('RUN_EVALUATION');
export const RUN_EVALUATION_START = RUN_EVALUATION + '_START';
export const RUN_EVALUATION_ERROR = RUN_EVALUATION + '_ERROR';
export const RUN_EVALUATION_SUCCESS = RUN_EVALUATION + '_SUCCESS';

export function runEvaluation(userPipelineDiscoveryId, pipelineId) {
  return dispatch => {
    const promise = api.runEvaluation(pipelineId)
      .then(message => {
        dispatch(notification(message));
        dispatch(getEvaluations(userPipelineDiscoveryId)); // TODO: okay, this is not really nice design
      })
      .catch(error => dispatch(notification(error.message)));
    dispatch(createAction(RUN_EVALUATION, { promise }, { id: pipelineId }));
  }
}

// No reducer as we are only interested in the status itself.

// Selectors

export function createStatusSelector(idExtractor) {
  return createPromiseStatusSelector(RUN_EVALUATION, idExtractor);
}

