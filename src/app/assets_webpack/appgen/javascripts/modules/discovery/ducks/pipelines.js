import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { List } from 'immutable'

export const GET_PIPELINES_START = 'GET_PIPELINES_START';
export const GET_PIPELINES_ERROR = 'GET_PIPELINES_ERROR';
export const GET_PIPELINES_SUCCESS = 'GET_PIPELINES_SUCCESS';

export function getPipelines(discoveryId) {
  const promise = api.getPipelines(discoveryId);
  return createAction('GET_PIPELINES', {promise, data: {discoveryId}});
}

const initialState = new List();

export default createPromiseReducer(initialState, [
  GET_PIPELINES_START,
  GET_PIPELINES_SUCCESS,
  GET_PIPELINES_ERROR]);
