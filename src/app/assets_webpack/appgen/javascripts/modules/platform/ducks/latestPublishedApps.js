import { createSelector } from 'reselect'
import { List, fromJS } from 'immutable'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import * as api from '../api'
import moduleSelector from '../selector'
import { Application } from '../../manageApp/models'
import storageReducerFactory from '../../../misc/storageReducerFactory'

// Actions

export const GET_LATEST_PUBLISHED_APPS = prefix('GET_LATEST_PUBLISHED_APPS');
export const GET_LATEST_PUBLISHED_APPS_START = GET_LATEST_PUBLISHED_APPS + '_START';
export const GET_LATEST_PUBLISHED_APPS_ERROR = GET_LATEST_PUBLISHED_APPS + '_ERROR';
export const GET_LATEST_PUBLISHED_APPS_SUCCESS = GET_LATEST_PUBLISHED_APPS + '_SUCCESS';
export const GET_LATEST_PUBLISHED_APPS_RESET = GET_LATEST_PUBLISHED_APPS + '_RESET';

export function getLatestPublishedApps() {
    const promise = api.getLatestPublishedApps();
    return createAction(GET_LATEST_PUBLISHED_APPS, { promise });
}

export function getLatestPublishedAppsReset() {
  return createAction(GET_LATEST_PUBLISHED_APPS_RESET);
}

// Reducer

export default storageReducerFactory()
  .setInitialState(new List())
  .setResetAction(GET_LATEST_PUBLISHED_APPS_RESET)
  .setUpdateAction(GET_LATEST_PUBLISHED_APPS_SUCCESS)
  .setUpdate((state, payload) => {
    return (new List(payload))
      .map(application => new Application(fromJS(application)))
  })
  .create();

// Selectors

export const latestPublishedAppsStatusSelector = createPromiseStatusSelector(GET_LATEST_PUBLISHED_APPS);
export const latestPublishedAppsSelector = createSelector([moduleSelector], state => state.latestPublishedApps);
