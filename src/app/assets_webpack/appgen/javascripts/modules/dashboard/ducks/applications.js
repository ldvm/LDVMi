import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as dashboardApi from '../api'
import * as appApi from '../../app/api'
import { withPaginationInfo, createPaginatedReducer, createEntitiesReducer, createPageContentSelector, createPagePromiseStatusSelector } from '../../core/ducks/lazyPagination'
import { Application } from '../../app/models'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import { notification } from '../../core/ducks/notifications'

// Actions

export const APPLICATIONS_PAGINATOR = prefix('APPLICATIONS_PAGINATOR');

export const GET_APPLICATIONS = prefix('GET_APPLICATIONS');
export const GET_APPLICATIONS_START = GET_APPLICATIONS + '_START';
export const GET_APPLICATIONS_ERROR = GET_APPLICATIONS + '_ERROR';
export const GET_APPLICATIONS_SUCCESS = GET_APPLICATIONS + '_SUCCESS';
export const GET_APPLICATIONS_RESET = GET_APPLICATIONS + '_RESET';

export function getApplications(page) {
  return withPaginationInfo(APPLICATIONS_PAGINATOR, page)(paginationInfo => {
    const promise = dashboardApi.getApplications(paginationInfo);
    return createAction(GET_APPLICATIONS, { promise });
  });
}

export function getApplicationsReset() {
  return createAction(GET_APPLICATIONS_RESET);
}

export const DELETE_APPLICATION = prefix('DELETE_APPLICATION');
export const DELETE_APPLICATION_START = DELETE_APPLICATION + '_START';
export const DELETE_APPLICATION_ERROR = DELETE_APPLICATION + '_ERROR';
export const DELETE_APPLICATION_SUCCESS = DELETE_APPLICATION + '_SUCCESS';
export function deleteApplication(id, page) {
  return dispatch => {
    const promise = appApi.deleteApp(id)
      .then(response => {
        dispatch(notification('The application has been deleted'));
        dispatch(getApplications(page));
        return response;
      })
      .catch(e => {
        dispatch(notification('Deleting the application failed!'));
        throw e;
      });
    dispatch(createAction(DELETE_APPLICATION, { promise }, { id }));
  }
}

// Reducers

const applicationsReducer = createEntitiesReducer(
  GET_APPLICATIONS_SUCCESS,
  GET_APPLICATIONS_RESET,
  app => new Application(app));

export default createPaginatedReducer(
  APPLICATIONS_PAGINATOR,
  GET_APPLICATIONS_SUCCESS,
  applicationsReducer);

// Selectors

const selector = createSelector([moduleSelector], state => state.applications);

export const createApplicationsSelector = pageSelector =>
  createSelector(
    [createPageContentSelector(APPLICATIONS_PAGINATOR, selector, pageSelector)],
    applications => applications.filter(app => app != null) // skip deleted apps
  );

export const createApplicationsStatusSelector = pageSelector =>
  createPagePromiseStatusSelector(GET_APPLICATIONS, APPLICATIONS_PAGINATOR, pageSelector);

export const createDeleteApplicationStatusSelector = idSelector =>
  createPromiseStatusSelector(DELETE_APPLICATION, idSelector);
