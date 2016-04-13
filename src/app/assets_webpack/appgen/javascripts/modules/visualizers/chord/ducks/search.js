import createAction from '../../../../misc/createAction'
import prefix from '../prefix'

// Actions

export const SEARCH = prefix('SEARCH');
export const SEARCH_START = SEARCH + '_START';
export const SEARCH_ERROR = SEARCH + '_ERROR';
export const SEARCH_SUCCESS = SEARCH + '_SUCCESS';

export function search(text) {
  // const promise = api.getMatrix(id, nodeUris);
  return createAction(SEARCH, { text });
}
