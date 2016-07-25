import prefix from '../../createApp/prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import { createPromiseStatusSelector } from './promises'

// Actions

export const GET_VIRTUOSO_STATUS = prefix('GET_VIRTUOSO_STATUS');
export const GET_VIRTUOSO_STATUS_START = prefix('GET_VIRTUOSO_STATUS_START');
export const GET_VIRTUOSO_STATUS_ERROR = prefix('GET_VIRTUOSO_STATUS_ERROR');
export const GET_VIRTUOSO_STATUS_SUCCESS = prefix('GET_VIRTUOSO_STATUS_SUCCESS');

export function getVirtuosoStatus() {
  const promise = api.getVirtuosoStatus();
  return createAction(GET_VIRTUOSO_STATUS, { promise });
}

// Selectors

export const virtuosoStatusSelector = createPromiseStatusSelector(GET_VIRTUOSO_STATUS);
