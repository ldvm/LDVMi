import { Set } from 'immutable'
import createAction from '../../../misc/createAction'
import { ADD_DATA_SOURCE } from './dataSources'

// Actions

export const SELECT_DATA_SOURCE = 'SELECT_DATA_SOURCE';
export const DESELECT_DATA_SOURCE = 'DESELECT_DATA_SOURCE';

export function selectDataSource(dataSourceId) {
  return createAction(SELECT_DATA_SOURCE, dataSourceId);
}

export function deselectDataSource(dataSourceId) {
  return createAction(DESELECT_DATA_SOURCE, dataSourceId);
}

// Reducer

const initialState = new Set();

export default function selectedDataSourcesReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_DATA_SOURCE:
      return state.add(action.payload);

    case DESELECT_DATA_SOURCE:
      return state.delete(action.payload);

    case ADD_DATA_SOURCE:
      const { payload: { dataSource }} = action;
      return state.add(dataSource.id);
  }

  return state;
}