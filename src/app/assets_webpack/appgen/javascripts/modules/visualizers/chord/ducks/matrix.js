import { createSelector } from 'reselect'
import createAction from '../../../../misc/createAction'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { VISUALIZE_SAMPLE_NODES_SUCCESS, VISUALIZE_SELECTED_NODES } from './visualizedNodes'
import * as api from '../api'
import withApplicationId from '../../../app/misc/withApplicationId'

// Actions

export const GET_MATRIX = prefix('GET_MATRIX');
export const GET_MATRIX_START = GET_MATRIX + '_START';
export const GET_MATRIX_ERROR = GET_MATRIX + '_ERROR';
export const GET_MATRIX_SUCCESS = GET_MATRIX + '_SUCCESS';

export function getMatrix(nodeUris) {
  return withApplicationId(id => {
    const promise = api.getMatrix(id, nodeUris);
    return createAction(GET_MATRIX, { promise });
  });
}

// Reducer

// We don't need immutable structure here. The matrix will be fairly big and it won't get modified.
const initialState = [];

export default function matrixReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:

    // This reducer has to be kept in sync with selected nodes so that it doesn't happen that
    // the visualizer gets filled adjacency matrix and no nodes.
    case VISUALIZE_SAMPLE_NODES_SUCCESS:
    case VISUALIZE_SELECTED_NODES:
      return initialState;

    case GET_MATRIX_SUCCESS:
      return action.payload;
  }

  return state;
}

// Selectors

export const matrixStatusSelector = createPromiseStatusSelector(GET_MATRIX);
export const matrixSelector = createSelector(moduleSelector, state => state.matrix);
