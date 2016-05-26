import { Map } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import { withPaginationInfo, createPaginatedPlaceholderReducer, createPageContentSelector, createPaginatedPromiseStatusSelector } from '../../core/ducks/pagination'
import { arrayToObject } from '../../../misc/utils'
import { Application } from '../../app/models'
import moduleSelector from '../selector'

// Actions

export const APPLICATIONS_PAGINATOR = prefix('APPLICATIONS_PAGINATOR');

export const GET_APPLICATIONS = prefix('GET_APPLICATIONS');
export const GET_APPLICATIONS_START = GET_APPLICATIONS + '_START';
export const GET_APPLICATIONS_ERROR = GET_APPLICATIONS + '_ERROR';
export const GET_APPLICATIONS_SUCCESS = GET_APPLICATIONS + '_SUCCESS';
export const GET_APPLICATIONS_RESET = GET_APPLICATIONS + '_RESET';

export function getApplications(page) {
  return withPaginationInfo(APPLICATIONS_PAGINATOR, page)(paginationInfo => {
    const promise = api.getApplications(paginationInfo);
    return createAction(GET_APPLICATIONS, { promise });
  });
}

export function getApplicationsReset() {
  return createAction(GET_APPLICATIONS_RESET);
}

// Reducers

export const paginatedApplicationsReducer = createPaginatedPlaceholderReducer(
  APPLICATIONS_PAGINATOR, GET_APPLICATIONS_SUCCESS, app => app.id);

const initialState = new Map();

export default function applicationsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATIONS_SUCCESS:
      const applications = (new Map(arrayToObject(action.payload.items, app => app.id)))
        .map(app => new Application(app));
      return state.merge(applications);

    case GET_APPLICATIONS_RESET:
      return initialState;
  }

  return state;
}

// Selectors

const applicationsSelector = createSelector([moduleSelector],
  state => state.applications);

const paginatedApplicationsSelector = createSelector([moduleSelector],
  state => state.paginatedApplications);

export const createApplicationsSelector = pageSelector => {
  const pageContentSelector = createPageContentSelector(
    APPLICATIONS_PAGINATOR, paginatedApplicationsSelector, pageSelector);

  return createSelector(
    [applicationsSelector, pageContentSelector],
    (applications, pageContent) => pageContent.map(id => applications.get(id + ''))
  );
};

export const createApplicationsStatusSelector = pageSelector =>
  createPaginatedPromiseStatusSelector(GET_APPLICATIONS, APPLICATIONS_PAGINATOR, pageSelector);
