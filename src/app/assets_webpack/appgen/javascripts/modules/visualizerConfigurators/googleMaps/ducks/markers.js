import { List } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import moduleSelector  from '../selector'
import createAction from '../../../../misc/createAction'
import * as api from '../api'

// Actions

export const GET_MARKERS = prefix('GET_MARKERS');
export const GET_MARKERS_START = GET_MARKERS + '_START';
export const GET_MARKERS_ERROR = GET_MARKERS + '_ERROR';
export const GET_MARKERS_SUCCESS = GET_MARKERS + '_SUCCESS';

export function getMarkers(appId, mapQueryData) {
  const promise = api.getMarkers(appId, mapQueryData);
  return createAction(GET_MARKERS, { promise });
}

// Reducer

const initialState = new List();

export default function markersReducer(state = initialState, action) {
  if (action.type == GET_MARKERS_SUCCESS) {
    return new List(action.payload);
  }

  return state;
}

// Selectors

export const markersSelector = createSelector(
  [moduleSelector],
  state => state.markers
);
