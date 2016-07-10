import { createSelector } from 'reselect'
import { Map, List } from 'immutable'
import * as api from '../api'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'
import { visualizersSelector } from './../../core/ducks/visualizers'
import { evaluationsSelector, promiseSelector as evaluationPromiseSelector } from './evaluations'
import { Discovery, PipelineWithEvaluations } from '../models'
import { VisualizerWithPipelines } from '../../core/models'
import { createPromiseStatusSelector } from '../../core/ducks/promises'

// Actions

export const GET_DISCOVERY = prefix('GET_DISCOVERY');
export const GET_DISCOVERY_START = GET_DISCOVERY + '_START';
export const GET_DISCOVERY_ERROR = GET_DISCOVERY + '_ERROR';
export const GET_DISCOVERY_SUCCESS = GET_DISCOVERY + '_SUCCESS';

export function getDiscovery(userPipelineDiscoveryId) {
  const promise = api.getDiscovery(userPipelineDiscoveryId);
  return createAction(prefix('GET_DISCOVERY'), { promise });
}

// Reducer

const initialState = Map();

export default function discoveryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DISCOVERY_SUCCESS:
      return state.mergeDeep(action.payload);

    default:
      return state;
  }
}

// Selectors

export const promiseSelector = createPromiseStatusSelector(GET_DISCOVERY);

const dataSelector = createSelector(
  [moduleSelector], state => state.discovery
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
