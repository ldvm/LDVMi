import { Map } from 'immutable'
import { createSelector } from 'reselect'
import * as api from '../api'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import { DataSource } from '../models'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../core/ducks/promises'

// Actions

export const GET_DATA_SOURCES = prefix('GET_DATA_SOURCES');
export const GET_DATA_SOURCES_START = prefix('GET_DATA_SOURCES_START');
export const GET_DATA_SOURCES_ERROR = prefix('GET_DATA_SOURCES_ERROR');
export const GET_DATA_SOURCES_SUCCESS = prefix('GET_DATA_SOURCES_SUCCESS');
export const GET_DATA_SOURCES_RESET = prefix('GET_DATA_SOURCES_RESET');

export function getDataSources() {
  const promise = api.getDataSources();
  return createAction(GET_DATA_SOURCES, { promise });
}

export function getDataSourcesReset() {
  return createAction(GET_DATA_SOURCES_RESET);
}

export const ADD_DATA_SOURCE = prefix('ADD_DATA_SOURCE');

export function addDataSource(dataSource) {
  return createAction(ADD_DATA_SOURCE, { dataSource });
}

// Reducer

const initialState = new Map();

export default function dataSourcesReducer(state = initialState, action) {
  switch (action.type) {

    case GET_DATA_SOURCES_SUCCESS:
      return action.payload.data.dataSources.reduce(
        (state, dataSource) => state.set(dataSource.id, new DataSource(dataSource)), state);

    case ADD_DATA_SOURCE:
      const { payload: { dataSource }} = action;
      return state.set(dataSource.id, new DataSource(dataSource));
  }

  return state;
};

// Selectors

export const dataSourcesSelector = createSelector([moduleSelector], state => state.dataSources);
export const getDataSourcesStatusSelector = createPromiseStatusSelector(GET_DATA_SOURCES);
