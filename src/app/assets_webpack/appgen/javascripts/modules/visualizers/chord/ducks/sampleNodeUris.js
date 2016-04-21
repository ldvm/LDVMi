import { List } from 'immutable'
import { createSelector } from 'reselect'
import createAction from '../../../../misc/createAction'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../manageApp/ducks/application'
import * as api from '../api'
import withApplicationId from '../../../manageApp/misc/withApplicationId'

// Actions

export const GET_SAMPLE_NODES = prefix('GET_SAMPLE_NODES');
export const GET_SAMPLE_NODES_START = GET_SAMPLE_NODES + '_START';
export const GET_SAMPLE_NODES_ERROR = GET_SAMPLE_NODES + '_ERROR';
export const GET_SAMPLE_NODES_SUCCESS = GET_SAMPLE_NODES + '_SUCCESS';

export function getSampleNodes() {
  return withApplicationId(id => {
    const promise = api.getSampleNodes(id);
    return createAction(GET_SAMPLE_NODES, { promise });
  });
}

// Reducer

const initialState = new List();

export default function sampleNodeUrisReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_SAMPLE_NODES_SUCCESS:
      return new List(action.payload.map(node => node.uri));
  }

  return state;
}

// Selectors

export const sampleNodeUrisStatusSelector = createPromiseStatusSelector(GET_SAMPLE_NODES);
export const sampleNodeUrisSelector = createSelector(moduleSelector, state => state.sampleNodeUris);
