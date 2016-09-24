import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import { withPaginationInfo, createPaginatedReducer, createEntitiesReducer, createPageContentSelector, createPagePromiseStatusSelector } from '../../core/ducks/lazyPagination'
import moduleSelector from '../selector'
import { Application } from '../../app/models'

// Actions

export const PUBLISHED_APPS_PAGINATOR = prefix('PUBLISHED_APPS_PAGINATOR');

export const GET_PUBLISHED_APPS = prefix('GET_PUBLISHED_APPS');
export const GET_PUBLISHED_APPS_START = GET_PUBLISHED_APPS + '_START';
export const GET_PUBLISHED_APPS_ERROR = GET_PUBLISHED_APPS + '_ERROR';
export const GET_PUBLISHED_APPS_SUCCESS = GET_PUBLISHED_APPS + '_SUCCESS';
export const GET_PUBLISHED_APPS_RESET = GET_PUBLISHED_APPS + '_RESET';

export function getPublishedApps(page) {
  return withPaginationInfo(PUBLISHED_APPS_PAGINATOR, page)(paginationInfo => {
    const promise = api.getPublishedApps(paginationInfo);
    return createAction(GET_PUBLISHED_APPS, { promise });
  });
}

export function getPublishedAppsReset() {
  return createAction(GET_PUBLISHED_APPS_RESET);
}

// Reducers

const publishedAppsReducer = createEntitiesReducer(
  GET_PUBLISHED_APPS_SUCCESS,
  GET_PUBLISHED_APPS_RESET,
  app => new Application(app));

export default createPaginatedReducer(
  PUBLISHED_APPS_PAGINATOR,
  GET_PUBLISHED_APPS_SUCCESS,
  publishedAppsReducer);

// Selectors

const selector = createSelector([moduleSelector], state => state.publishedApps);

export const createPublishedAppsSelector = pageSelector =>
  createPageContentSelector(PUBLISHED_APPS_PAGINATOR, selector, pageSelector);

export const createPublishedAppsStatusSelector = pageSelector =>
  createPagePromiseStatusSelector(GET_PUBLISHED_APPS, PUBLISHED_APPS_PAGINATOR, pageSelector);
