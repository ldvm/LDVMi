import { OrderedSet } from 'immutable'
import { createSelector } from 'reselect'
import createAction from '../../../../misc/createAction'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../manageApp/ducks/application'
import * as api from '../api'
import withApplicationId from '../../../manageApp/misc/withApplicationId'
import { selectedListSelector } from './selectedList'

// Actions

export const VISUALIZE_SAMPLE_NODES = prefix('VISUALIZE_SAMPLE_NODES');
export const VISUALIZE_SAMPLE_NODES_START = VISUALIZE_SAMPLE_NODES + '_START';
export const VISUALIZE_SAMPLE_NODES_ERROR = VISUALIZE_SAMPLE_NODES + '_ERROR';
export const VISUALIZE_SAMPLE_NODES_SUCCESS = VISUALIZE_SAMPLE_NODES + '_SUCCESS';

export function visualizeSampleNodes() {
  return withApplicationId(id => {
    const promise = api.getSampleNodes(id);
    return createAction(VISUALIZE_SAMPLE_NODES, { promise });
  });
}

export const VISUALIZE_SELECTED_NODES = prefix('VISUALIZE_SELECTED_NODES');
export function visualizeSelectedNodes() {
  return (dispatch, getState) => {
    const selectedList = selectedListSelector(getState());
    if (selectedList) {
      const nodeUris = selectedList.selected;
      dispatch(createAction(VISUALIZE_SELECTED_NODES, { nodeUris }));
    }
  }
}

// Reducer

const initialState = new OrderedSet();

export default function visualizedNodesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case VISUALIZE_SAMPLE_NODES_SUCCESS:
      return new OrderedSet(action.payload.map(node => node.uri));
    
    case VISUALIZE_SELECTED_NODES:
      return new OrderedSet(action.payload.nodeUris);
  }

  return state;
}

// Selectors

export const visualizeSampleNodesStatusSelector = createPromiseStatusSelector(VISUALIZE_SAMPLE_NODES);
export const visualizedNodesSelector = createSelector(moduleSelector, state => state.visualizedNodes);
