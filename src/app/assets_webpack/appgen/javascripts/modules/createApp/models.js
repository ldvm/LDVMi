import { List, Record } from 'immutable';

export const DataSource = Record({
  id: 0,
  name: '',
  isPublic: false,
  userId: 0,
  dataSourceTemplateId: 0,
  selected: false
});

export const Discovery = Record({
  id: 0,
  name: '',
  userId: 0,
  pipelineDiscoveryId: 0,
  isFinished: false,
  isSuccess: false,
  pipelinesDiscoveredCount: 0,
  createdUtc: 0,
  modifiedUtc: 0
});

export const Pipeline = Record({
  id: 0,
  bindingSetId: 0,
  title: '',
  uuid: '',
  visualizer: 'google-maps' // TODO: this should be somehow generated
});

const visualizerProps = {
  id: 0,
  stringId: '',
  name: '',
  icon: ''
};
export const Visualizer = Record(visualizerProps);

export const VisualizerWithPipelines = Record({
  ...visualizerProps,
  pipelines: new List()
});
