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

const pipelineProps = {
  id: 0,
  bindingSetId: 0,
  title: '',
  uuid: '',
  visualizerComponentTemplateId: 0
};
export const Pipeline = Record(pipelineProps);

export const PipelineWithEvaluations = Record({
  ...pipelineProps,
  evaluations: new List()
});

export const Evaluation = Record({
  id: 0,
  isFinished: false,
  isSuccess: false,
  modifiedUtc: 0,
  createdUtc: 0,
  pipelineId: 0,
  uuid: ""
});
