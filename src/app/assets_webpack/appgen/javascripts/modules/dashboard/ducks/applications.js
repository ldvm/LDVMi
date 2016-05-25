import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import { withPaginationInfo, resetPaginator } from '../../core/ducks/pagination'

// Actions

export const APPLICATIONS_PAGINATOR = prefix('APPLICATIONS_PAGINATOR');

export const GET_APPLICATIONS = prefix('GET_APPLICATIONS');
export const GET_APPLICATIONS_START = GET_APPLICATIONS + '_START';
export const GET_APPLICATIONS_ERROR = GET_APPLICATIONS + '_ERROR';
export const GET_APPLICATIONS_SUCCESS = GET_APPLICATIONS + '_SUCCESS';

export function getApplications(page) {
  return withPaginationInfo(APPLICATIONS_PAGINATOR, page)(paginationInfo => {
    const promise = api.getApplications(paginationInfo);
    return createAction(GET_APPLICATIONS, { promise });
  });
}

// Reducers
