import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as dashboardApi from '../api'
import { withPaginationInfo, createPaginatedReducer, createEntitiesReducer, createPageContentSelector, createPagePromiseStatusSelector } from '../../core/ducks/lazyPagination'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import { Discovery } from '../../createApp/models'
import { notification } from '../../core/ducks/notifications'

// Actions

export const DISCOVERIES_PAGINATOR = prefix('DISCOVERIES_PAGINATOR');

export const GET_DISCOVERIES = prefix('GET_DISCOVERIES');
export const GET_DISCOVERIES_START = GET_DISCOVERIES + '_START';
export const GET_DISCOVERIES_ERROR = GET_DISCOVERIES + '_ERROR';
export const GET_DISCOVERIES_SUCCESS = GET_DISCOVERIES + '_SUCCESS';
export const GET_DISCOVERIES_RESET = GET_DISCOVERIES + '_RESET';

export function getDiscoveries(page) {
  return withPaginationInfo(DISCOVERIES_PAGINATOR, page)(paginationInfo => {
    const promise = dashboardApi.getDiscoveries(paginationInfo);
    return createAction(GET_DISCOVERIES, { promise });
  });
}

export function getDiscoveriesReset() {
  return createAction(GET_DISCOVERIES_RESET);
}

export const DELETE_DISCOVERY = prefix('DELETE_DISCOVERY');
export const DELETE_DISCOVERY_START = DELETE_DISCOVERY + '_START';
export const DELETE_DISCOVERY_ERROR = DELETE_DISCOVERY + '_ERROR';
export const DELETE_DISCOVERY_SUCCESS = DELETE_DISCOVERY + '_SUCCESS';
export function deleteDiscovery(id, page) {
  return dispatch => {
    const promise = dashboardApi.deleteDiscovery(id)
      .then(response => {
        dispatch(notification('The discovery has been deleted'));
        dispatch(getDiscoveries(page));
        return response;
      })
      .catch(e => {
        dispatch(notification('Deleting the discovery failed!'));
        throw e;
      });
    dispatch(createAction(DELETE_DISCOVERY, { promise }, { id }));
  }
}

// Reducers

const discoveriesReducer = createEntitiesReducer(
  GET_DISCOVERIES_SUCCESS,
  GET_DISCOVERIES_RESET,
  app => new Discovery(app));

export default createPaginatedReducer(
  DISCOVERIES_PAGINATOR,
  GET_DISCOVERIES_SUCCESS,
  discoveriesReducer);

// Selectors

const selector = createSelector([moduleSelector], state => state.discoveries);

export const createDiscoveriesSelector = pageSelector =>
  createSelector(
    [createPageContentSelector(DISCOVERIES_PAGINATOR, selector, pageSelector)],
    discoveries => discoveries.filter(discovery => discovery != null) // skip deleted
  );

export const createDiscoveriesStatusSelector = pageSelector =>
  createPagePromiseStatusSelector(GET_DISCOVERIES, DISCOVERIES_PAGINATOR, pageSelector);

export const createDeleteDiscoveryStatusSelector = idSelector =>
  createPromiseStatusSelector(DELETE_DISCOVERY, idSelector);
