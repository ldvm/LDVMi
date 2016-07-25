import { createSelector, createStructuredSelector } from 'reselect'
import { Map, List, fromJS } from 'immutable'
import * as api from '../api'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'
import { visualizersSelector } from './../../core/ducks/visualizers'
import { evaluationsSelector, promiseSelector as evaluationPromiseSelector } from './evaluations'
import { Discovery, PipelineWithEvaluations } from '../models'
import { VisualizerWithPipelines } from '../../core/models'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import {selectedVisualizerIdSelector} from "./selectedVisualizer";

// Actions

export const GET_DISCOVERY = prefix('GET_DISCOVERY');
export const GET_DISCOVERY_START = GET_DISCOVERY + '_START';
export const GET_DISCOVERY_ERROR = GET_DISCOVERY + '_ERROR';
export const GET_DISCOVERY_SUCCESS = GET_DISCOVERY + '_SUCCESS';
export const GET_DISCOVERY_RESET = GET_DISCOVERY + '_RESET';

export function getDiscovery(userPipelineDiscoveryId) {
  const promise = api.getDiscovery(userPipelineDiscoveryId);
  return createAction(GET_DISCOVERY, { promise });
}

export function getDiscoveryReset() {
  return createAction(GET_DISCOVERY_RESET);
}

// Reducer

const initialState = Map();

export default function discoveryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DISCOVERY_SUCCESS:
      // Cannot merge, we need to create a new instance to indicate that it is actually new data
      return fromJS(action.payload);

    case GET_DISCOVERY_RESET:
      return initialState;

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

const unsupportedPipelinesSelector = createSelector(
  [pipelinesSelector, visualizersSelector],
  (pipelines, visualizers) => pipelines.filter(pipeline =>
    visualizers.find(visualizer =>
      visualizer.componentTemplateId == pipeline.visualizerComponentTemplateId) == null)
);

const selectedVisualizerSelector = createSelector(
  [selectedVisualizerIdSelector, pipelineVisualizersSelector],
  (id, visualizers) => visualizers.find(visualizer => visualizer.id == id) || new VisualizerWithPipelines()
);

export const discoverySelector = createStructuredSelector({
  status: promiseSelector,
  discovery: mergedDiscoverySelector,
  pipelines: pipelinesSelector,
  unsupportedPipelines: unsupportedPipelinesSelector,
  visualizers: pipelineVisualizersSelector,
  evaluations: evaluationsSelector,
  selectedVisualizer: selectedVisualizerSelector
});
