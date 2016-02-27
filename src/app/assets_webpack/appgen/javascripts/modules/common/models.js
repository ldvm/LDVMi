import { Record, List } from 'immutable';

const visualizerProps = {
  id: 0,
  title: '',
  description: '',
  uri: '',
  icon: '',
  componentTemplateId: 0
};
export const Visualizer = Record(visualizerProps);

export const VisualizerWithPipelines = Record({
  ...visualizerProps,
  pipelines: new List()
});

