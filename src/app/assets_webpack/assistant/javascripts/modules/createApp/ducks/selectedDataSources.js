import { Set } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import { ADD_DATA_SOURCE } from './dataSources'
import moduleSelector from '../selector'

// Actions

export const SELECT_DATA_SOURCE = prefix('SELECT_DATA_SOURCE');
export function selectDataSource(dataSourceId) {
  return createAction(SELECT_DATA_SOURCE, dataSourceId);
}

export const DESELECT_DATA_SOURCE = prefix('DESELECT_DATA_SOURCE');
export function deselectDataSource(dataSourceId) {
  return createAction(DESELECT_DATA_SOURCE, dataSourceId);
}

export const DESELECT_ALL_DATA_SOURCES = prefix('DESELECT_ALL_DATA_SOURCES');
export function deselectAllDataSources() {
  return createAction(DESELECT_ALL_DATA_SOURCES);
}

// Reducer

const initialState = new Set();

export default function selectedDataSourcesReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_DATA_SOURCE:
      return state.add(action.payload);

    case DESELECT_DATA_SOURCE:
      return state.delete(action.payload);

    case DESELECT_ALL_DATA_SOURCES:
      return initialState;

    case ADD_DATA_SOURCE:
      const { payload: { dataSource }} = action;
      return state.add(dataSource.id);
  }

  return state;
}

// Selectors

export const selectedDataSourcesSelector = createSelector([moduleSelector],
  state => state.selectedDataSources);
