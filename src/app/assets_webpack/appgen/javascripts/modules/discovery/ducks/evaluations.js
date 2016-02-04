import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { List } from 'immutable'

export const GET_PIPELINE_EVALUATIONS_START = 'GET_PIPELINE_EVALUATIONS_START';
export const GET_PIPELINE_EVALUATIONS_ERROR = 'GET_PIPELINE_EVALUATIONS_ERROR';
export const GET_PIPELINE_EVALUATIONS_SUCCESS = 'GET_PIPELINE_EVALUATIONS_SUCCESS';

export function getPipelineEvaluations(pipelineId) {
  const promise = api.getPipelineEvaluations(pipelineId);
  return createAction('GET_PIPELINE_EVALUATIONS', {promise, data: {pipelineId}});
}

const initialState = new List();

export default createPromiseReducer(initialState, [
  GET_PIPELINE_EVALUATIONS_START,
  GET_PIPELINE_EVALUATIONS_SUCCESS,
  GET_PIPELINE_EVALUATIONS_ERROR]);
