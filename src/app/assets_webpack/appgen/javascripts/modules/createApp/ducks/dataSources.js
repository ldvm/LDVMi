import { fromJS, Map } from 'immutable'
import * as api from '../api'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { arrayToObject } from '../../../misc/utils'

export const GET_DATA_SOURCES_START = 'GET_DATA_SOURCES_START';
export const GET_DATA_SOURCES_ERROR = 'GET_DATA_SOURCES_ERROR';
export const GET_DATA_SOURCES_SUCCESS = 'GET_DATA_SOURCES_SUCCESS';

// Actions

export function getDataSources() {
  const promise = api.getDataSources();
  return createAction('GET_DATA_SOURCES', {promise});
}

// Reducer

const initialState = new Map();

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_SOURCES_SUCCESS:
      const obj = arrayToObject(action.payload.data.dataSources, dataSource => dataSource.id);
      return fromJS(obj);
  }
  return state;
};

export default createPromiseReducer(initialState, [
  GET_DATA_SOURCES_START,
  GET_DATA_SOURCES_SUCCESS,
  GET_DATA_SOURCES_ERROR], reducer);
