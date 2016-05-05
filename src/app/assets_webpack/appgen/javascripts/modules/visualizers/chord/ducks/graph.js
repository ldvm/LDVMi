import { createSelector } from 'reselect'
import prefix from '../prefix'
import moduleSelector from '../selector'
import createAction from '../../../../misc/createAction'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import { Graph } from '../models'
import { GET_APPLICATION_START } from '../../../manageApp/ducks/application'
import * as api from '../api'
import withApplicationId from '../../../manageApp/misc/withApplicationId'

// Actions

export const GET_GRAPH = prefix('GET_GRAPH');
export const GET_GRAPH_START = GET_GRAPH + '_START';
export const GET_GRAPH_ERROR = GET_GRAPH + '_ERROR';
export const GET_GRAPH_SUCCESS = GET_GRAPH + '_SUCCESS';
export const GET_GRAPH_RESET = GET_GRAPH + '_RESET';

export function getGraph() {
  return withApplicationId(id => {
    const promise = api.getGraph(id);
    return createAction(GET_GRAPH, { promise });
  })
}

export function getGraphReset() {
  return createAction(GET_GRAPH_RESET);
}

// Reducer

const initialState = new Graph();

export default function graphReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
    case GET_GRAPH_RESET:
      return initialState;

    case GET_GRAPH_SUCCESS:
      return new Graph(action.payload);
  }

  return state;
};

// Selectors

export const graphStatusSelector = createPromiseStatusSelector(GET_GRAPH);

export const graphSelector = createSelector([moduleSelector], state => state.graph);
