import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { Pipeline } from '../models'

export const GET_PIPELINE_START = 'GET_PIPELINE_START';
export const GET_PIPELINE_ERROR = 'GET_PIPELINE_ERROR';
export const GET_PIPELINE_SUCCESS = 'GET_PIPELINE_SUCCESS';

export function getPipeline(pipelineId) {
  const promise = api.getPipeline(pipelineId);
  return createAction('GET_PIPELINE', {promise, data: {pipelineId}});
}

const initialState = Pipeline();

export default createPromiseReducer(initialState, [
  GET_PIPELINE_START,
  GET_PIPELINE_SUCCESS,
  GET_PIPELINE_ERROR]);
