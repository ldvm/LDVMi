import { createSelector } from 'reselect'
import { Map } from 'immutable'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../app/ducks/application'
import * as api from '../api'
import moduleSelector from '../selector'
import storageReducerFactory from '../../../misc/storageReducerFactory'

// Misc

function hashNodeUris(nodeUris) {
  return hash(nodeUris.sort().join());
}

// Actions

export const GET_VISUALIZER_COMPONENTS = prefix('GET_VISUALIZER_COMPONENTS');
export const GET_VISUALIZER_COMPONENTS_START = GET_VISUALIZER_COMPONENTS + '_START';
export const GET_VISUALIZER_COMPONENTS_ERROR = GET_VISUALIZER_COMPONENTS + '_ERROR';
export const GET_VISUALIZER_COMPONENTS_SUCCESS = GET_VISUALIZER_COMPONENTS + '_SUCCESS';
export const GET_VISUALIZER_COMPONENTS_RESET = GET_VISUALIZER_COMPONENTS + '_RESET';

export function getVisualizerComponents() {
  const promise = api.getVisualizerComponents();
  return createAction(GET_VISUALIZER_COMPONENTS, { promise });
}

export function getVisualizerComponentsReset() {
  return createAction(GET_VISUALIZER_COMPONENTS_RESET);
}

// Reducer

export default storageReducerFactory()
  .setInitialState(new Map())
  .setResetAction(GET_VISUALIZER_COMPONENTS_RESET)
  .setUpdateAction(GET_VISUALIZER_COMPONENTS_SUCCESS)
  .setUpdate((state, payload) =>
    payload.reduce((state, vc) => state.set(vc.id, vc), state)
  )
  .create();

// Selectors

export const visualizerComponentsStatusSelector = createPromiseStatusSelector(GET_VISUALIZER_COMPONENTS);
export const visualizerComponentsSelector = createSelector([moduleSelector], state => state.visualizerComponents);
