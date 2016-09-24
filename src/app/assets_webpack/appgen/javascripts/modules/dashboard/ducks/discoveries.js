import { createSelector } from 'reselect'
import { Map } from 'immutable'
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

export const GET_DISCOVERY = prefix('GET_DISCOVERY');
export const GET_DISCOVERY_START = GET_DISCOVERY + '_START';
export const GET_DISCOVERY_ERROR = GET_DISCOVERY + '_ERROR';
export const GET_DISCOVERY_SUCCESS = GET_DISCOVERY + '_SUCCESS';

export function getDiscovery(id) {
  const promise = dashboardApi.getDiscovery(id);
  return createAction(GET_DISCOVERY, { promise });
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

export const DELETE_ALL_DISCOVERIES = prefix('DELETE_ALL_DISCOVERIES');
export const DELETE_ALL_DISCOVERIES_START = DELETE_ALL_DISCOVERIES + '_START';
export const DELETE_ALL_DISCOVERIES_ERROR = DELETE_ALL_DISCOVERIES + '_ERROR';
export const DELETE_ALL_DISCOVERIES_SUCCESS = DELETE_ALL_DISCOVERIES + '_SUCCESS';
export function deleteAllDiscoveries() {
  return dispatch => {
    const promise = dashboardApi.deleteAllDiscoveries()
      .then(response => {
        dispatch(notification('All discoveries have been deleted'));
        dispatch(getDiscoveries(1));
        return response;
      })
      .catch(e => {
        dispatch(notification('Deleting discoveries failed!'));
        throw e;
      });
    dispatch(createAction(DELETE_ALL_DISCOVERIES, { promise }));
  }
}

// Reducers

const initialState = new Map();

function discoveriesReducer(state = initialState, action) {
  switch (action.type) {

    case GET_DISCOVERIES_SUCCESS:
      return action.payload.items.reduce(
        (state, discovery) => state.set(discovery.id, new Discovery(discovery)), state);

    case GET_DISCOVERY_SUCCESS:
      return state.set(action.payload.id, new Discovery(action.payload));

    case GET_DISCOVERIES_RESET:
      return initialState;
  }

  return state;
}

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
