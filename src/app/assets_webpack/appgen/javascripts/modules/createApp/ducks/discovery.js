import { createSelector } from 'reselect'
import { fromJS, Map, List } from 'immutable'
import * as api from '../api'
import prefix from '../prefix'
import createPromiseReducer, { PRESERVE_STATE } from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { discoverySelector as reducerSelector } from '../selector'
import { visualizersSelector } from './visualizers'
import { evaluationsSelector, promiseSelector as evaluationPromiseSelector } from './evaluations'
import { Discovery, PipelineWithEvaluations, VisualizerWithPipelines } from '../models'

// Actions

export const GET_DISCOVERY_START = prefix('GET_DISCOVERY_START');
export const GET_DISCOVERY_ERROR = prefix('GET_DISCOVERY_ERROR');
export const GET_DISCOVERY_SUCCESS = prefix('GET_DISCOVERY_SUCCESS');

export function getDiscovery(userPipelineDiscoveryId) {
  const promise = api.getDiscovery(userPipelineDiscoveryId);
  return createAction(prefix('GET_DISCOVERY'), { promise });
}

// Reducer

const initialState = Map();

const reducer = (state, action) => {
  switch (action.type) {
    case GET_DISCOVERY_SUCCESS:
      // Update the local state only if the incoming state is different.
      const newState = fromJS(action.payload);
      return state.equals(newState) ? state : newState;
  }

  return state;
};

export default createPromiseReducer(initialState, [
  GET_DISCOVERY_START,
  GET_DISCOVERY_SUCCESS,
  GET_DISCOVERY_ERROR], reducer, PRESERVE_STATE);

// Selectors

const promiseSelector = createSelector(
  [reducerSelector], ({ error, isLoading }) => ({ error, isLoading })
);

const dataSelector = createSelector(
  [reducerSelector], ({ data }) => data
);

const mergedDiscoverySelector = createSelector(
  [dataSelector],
  data => data.has('pipelineDiscovery') && data.has('userPipelineDiscovery') ?
    // Careful here, order of merging is important because both objects contain an id property.
    new Discovery(data.get('pipelineDiscovery').merge(data.get('userPipelineDiscovery'))) : null
);

const pipelinesSelector = createSelector(
  [dataSelector, evaluationsSelector],
  (data, evaluations) => data.has('pipelines') ? data.get('pipelines')
    .map(pipeline =>

      // Add evaluations to the pipeline object
      (new PipelineWithEvaluations(pipeline))
        .set('evaluations', evaluations.filter(evaluation => evaluation.pipelineId == pipeline.get('id')))
    ) : List()
);

const pipelineVisualizersSelector = createSelector(
  [pipelinesSelector, visualizersSelector],
  (pipelines, visualizers) => visualizers

    // Group pipelines by visualizers
    .map(visualizer => new VisualizerWithPipelines({
        ...visualizer.toJS(), // spread operator doesn't work on Records!
        pipelines: pipelines.filter(pipeline => pipeline.visualizerComponentTemplateId == visualizer.componentTemplateId)
      }))

    // Remove visualizers without any pipelines
    .filter(visualizer => visualizer.pipelines.size > 0)
);

// This rather complex hierarchy of selectors makes sure that the memoization works correctly.
export const discoverySelector = createSelector(
  [promiseSelector, mergedDiscoverySelector, pipelinesSelector, pipelineVisualizersSelector, evaluationsSelector, evaluationPromiseSelector], // TODO: evaluationPromiseSelector is also very ugly, let's do something with that in the next step
  ({error, isLoading}, discovery, pipelines, visualizers, evaluations, evaluationsPromise) => ({
    error, isLoading, discovery, pipelines, visualizers, evaluations, evaluationsPromise
  })
);
