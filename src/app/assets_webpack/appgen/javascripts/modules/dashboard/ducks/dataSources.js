import { createSelector } from 'reselect'
import { Map } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as dashboardApi from '../api'
import { withPaginationInfo, createPaginatedReducer, createPageContentSelector, createPagePromiseStatusSelector } from '../../core/ducks/lazyPagination'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import { notification } from '../../core/ducks/notifications'
import { DataSource } from '../../createApp/models'

// Actions

export const DATA_SOURCES_PAGINATOR = prefix('DATA_SOURCES_PAGINATOR');

export const GET_DATA_SOURCES = prefix('GET_DATA_SOURCES');
export const GET_DATA_SOURCES_START = GET_DATA_SOURCES + '_START';
export const GET_DATA_SOURCES_ERROR = GET_DATA_SOURCES + '_ERROR';
export const GET_DATA_SOURCES_SUCCESS = GET_DATA_SOURCES + '_SUCCESS';
export const GET_DATA_SOURCES_RESET = GET_DATA_SOURCES + '_RESET';

export function getDataSources(page) {
  return withPaginationInfo(DATA_SOURCES_PAGINATOR, page)(paginationInfo => {
    const promise = dashboardApi.getDataSources(paginationInfo);
    return createAction(GET_DATA_SOURCES, { promise });
  });
}

export function getDataSourcesReset() {
  return createAction(GET_DATA_SOURCES_RESET);
}

export const DELETE_DATA_SOURCE = prefix('DELETE_DATA_SOURCE');
export const DELETE_DATA_SOURCE_START = DELETE_DATA_SOURCE + '_START';
export const DELETE_DATA_SOURCE_ERROR = DELETE_DATA_SOURCE + '_ERROR';
export const DELETE_DATA_SOURCE_SUCCESS = DELETE_DATA_SOURCE + '_SUCCESS';
export function deleteDataSource(id, page) {
  return dispatch => {
    const promise = dashboardApi.deleteDataSource(id)
      .then(response => {
        dispatch(notification('The data source has been deleted'));
        dispatch(getDataSources(page));
        return response;
      })
      .catch(e => {
        dispatch(notification('Deleting the data source failed!'));
        throw e;
      });
    dispatch(createAction(DELETE_DATA_SOURCE, { promise }, { id }));
  }
}

// TODO: update data source

// Reducers

const initialState = new Map();

function dataSourcesReducer(state = initialState, action) {
  switch (action.type) {

    case GET_DATA_SOURCES_SUCCESS:
      return action.payload.items.reduce(
        (state, dataSource) => state.set(dataSource.id, new DataSource(dataSource)), state);

    // TODO: update data source

    case GET_DATA_SOURCES_RESET:
      return initialState;
  }

  return state;
}

export default createPaginatedReducer(
  DATA_SOURCES_PAGINATOR,
  GET_DATA_SOURCES_SUCCESS,
  dataSourcesReducer);

// Selectors

const selector = createSelector([moduleSelector], state => state.dataSources);

export const createDataSourcesSelector = pageSelector =>
  createSelector(
    [createPageContentSelector(DATA_SOURCES_PAGINATOR, selector, pageSelector)],
    dataSources => dataSources.filter(discovery => discovery != null) // skip deleted
  );

export const createDataSourcesStatusSelector = pageSelector =>
  createPagePromiseStatusSelector(GET_DATA_SOURCES, DATA_SOURCES_PAGINATOR, pageSelector);

export const createDeleteDataSourceStatusSelector = idSelector =>
  createPromiseStatusSelector(DELETE_DATA_SOURCE, idSelector);
