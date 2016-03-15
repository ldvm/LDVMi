import { List } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import moduleSelector  from '../selector'
import { createPromiseStatusSelector } from '../../../../ducks/promises'
import createAction from '../../../../misc/createAction'
import * as api from '../api'

// Actions

export const GET_MARKERS = prefix('GET_MARKERS');
export const GET_MARKERS_START = GET_MARKERS + '_START';
export const GET_MARKERS_ERROR = GET_MARKERS + '_ERROR';
export const GET_MARKERS_SUCCESS = GET_MARKERS + '_SUCCESS';

export function getMarkers(appId, filters) {
  const mapQueryData = {
    filters: filters.filter(filter => filter.enabled).map(filter => filter.options
      .map(option => ({uri: option.skosConcept.uri, isActive: option.selected})).toList()
    ).toJS()
  };
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

export const markersStatusSelector = createPromiseStatusSelector(GET_MARKERS);

export const markersSelector = createSelector(
  [moduleSelector],
  state => state.markers
);
