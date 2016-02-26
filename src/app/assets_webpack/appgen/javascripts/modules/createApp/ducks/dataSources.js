import { fromJS, Map } from 'immutable'
import * as api from '../api'
import prefix from '../prefix'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { arrayToObject } from '../../../misc/utils'

export const GET_DATA_SOURCES_START = prefix('GET_DATA_SOURCES_START');
export const GET_DATA_SOURCES_ERROR = prefix('GET_DATA_SOURCES_ERROR');
export const GET_DATA_SOURCES_SUCCESS = prefix('GET_DATA_SOURCES_SUCCESS');
export const ADD_DATA_SOURCE = prefix('ADD_DATA_SOURCE');

// Actions

export function getDataSources() {
  const promise = api.getDataSources();
  return createAction(prefix('GET_DATA_SOURCES'), {promise});
}

export function addDataSource(dataSource) {
  return createAction(ADD_DATA_SOURCE, {dataSource});
}

// Reducer

const initialState = new Map();

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_SOURCES_SUCCESS:
      const obj = arrayToObject(action.payload.data.dataSources, dataSource => dataSource.id);
      return fromJS(obj);

    case ADD_DATA_SOURCE:
      const { payload: { dataSource }} = action;
      return state.set(dataSource.id, fromJS(dataSource));
  }

  return state;
};

export default createPromiseReducer(initialState, [
  GET_DATA_SOURCES_START,
  GET_DATA_SOURCES_SUCCESS,
  GET_DATA_SOURCES_ERROR], reducer);
