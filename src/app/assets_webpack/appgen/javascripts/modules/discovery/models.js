import { Record } from 'immutable';

export const Pipeline = Record({
  id: 0,
  bindingSetId: 0,
  title: "",
  uuid: ""
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