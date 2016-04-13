import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import * as api from '../api'

// Actions

export const SEARCH = prefix('SEARCH');
export const SEARCH_START = SEARCH + '_START';
export const SEARCH_ERROR = SEARCH + '_ERROR';
export const SEARCH_SUCCESS = SEARCH + '_SUCCESS';

export function search(id, needle) {
  const promise = api.searchNodes(id, needle);
  return createAction(SEARCH, { promise });
}
