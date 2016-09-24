import { List, Record } from 'immutable';

export const Application = Record({
  id: 0,
  name: '',
  uid: '',
  description: '',
  published: false,
  userId: 0,
  pipelineId: 0,
  userPipelineDiscoveryId: 0,
  visualizerComponentTemplateId: 0
});
