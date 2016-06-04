import { Record, List } from 'immutable';

const visualizerProps = {
  id: 0,
  uri: '',
  visualizationUri: '',
  title: 'Unknown visualizer',
  priority: 0,
  name: '',
  icon: 'help',
  disabled: true,
  description: '',
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

/** Representation of paginator state */
export const Paginator = Record({
  page: 1,
  pageSize: 10,
  totalCount: null
});

/**
 * Representation of the "intent" to fetch a page of items. We don't really need this record as
 * it to a large extent represents the same information as Paginator. We use it for semantics
 * purposes (it makes certain operations nicer) and it's also a counter-part to Scala's
 * PaginationInfo (we use it for request).
 */
export const PaginationInfo = Record({
  skipCount: 0,
  pageSize: 10
});
