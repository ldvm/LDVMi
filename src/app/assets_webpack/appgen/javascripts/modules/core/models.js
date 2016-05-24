import { Record, List } from 'immutable';

const visualizerProps = {
  id: 0,
  title: '',
  name: '',
  description: '',
  uri: '',
  icon: '',
  supported: false,
  componentTemplateId: 0
};
export const Visualizer = Record(visualizerProps);

export const VisualizerWithPipelines = Record({
  ...visualizerProps,
  pipelines: new List()
});

/** Representation of a single promise status */
export const PromiseStatus = Record({
  error: "",
  isLoading: false,
  done: false
});

export const Paginator = Record({
  page: 1,
  pageSize: 10,
  total: null
});
