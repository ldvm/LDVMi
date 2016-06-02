import { createSelector } from 'reselect'
import { List, fromJS } from 'immutable'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import * as dashboardApi from '../../dashboard/api'
import moduleSelector from '../selector'
import { Application } from '../../app/models'
import storageReducerFactory from '../../../misc/storageReducerFactory'
import { PaginationInfo } from '../../core/models'

// Actions

export const GET_LATEST_USER_APPS = prefix('GET_LATEST_USER_APPS');
export const GET_LATEST_USER_APPS_START = GET_LATEST_USER_APPS + '_START';
export const GET_LATEST_USER_APPS_ERROR = GET_LATEST_USER_APPS + '_ERROR';
export const GET_LATEST_USER_APPS_SUCCESS = GET_LATEST_USER_APPS + '_SUCCESS';
export const GET_LATEST_USER_APPS_RESET = GET_LATEST_USER_APPS + '_RESET';

export function getLatestUserApps() {
  const promise = dashboardApi.getApplications(new PaginationInfo({ skipCount: 0, pageSize: 5 }));
  return createAction(GET_LATEST_USER_APPS, { promise });
}

export function getLatestUserAppsReset() {
  return createAction(GET_LATEST_USER_APPS_RESET);
}

// Reducer

export default storageReducerFactory()
  .setInitialState(new List())
  .setResetAction(GET_LATEST_USER_APPS_RESET)
  .setUpdateAction(GET_LATEST_USER_APPS_SUCCESS)
  .setUpdate((state, payload) => {
    return (new List(payload.items))
      .map(application => new Application(fromJS(application)))
  })
  .create();

// Selectors

export const latestUserAppsStatusSelector = createPromiseStatusSelector(GET_LATEST_USER_APPS);
export const latestUserAppsSelector = createSelector([moduleSelector], state => state.latestUserApps);
