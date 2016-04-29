import { OrderedSet, List, Record } from 'immutable';

export const Graph = Record({
  directed: false,
  nodeCount: 0,
  edgeCount: 0
});

export const Node = Record({
  uri: '',
  label: '',
  inDegree: '',
  outDegree: ''
});

export const NodeList = Record({
  id: '',
  name: 'Unlabeled list',
  uris: new OrderedSet(),
  selected: new OrderedSet()
});

export const PublishSettings = Record({
  showLists: true,
  allowSwitchingLists: true,
  allowSelectingNodes: true
});

// Fresnel stuff (TODO: move to the core module?)

export const Lens = Record({
  uri: '',
  purpose: '',
  domain: '',
  showProperties: new List()
});

Lens.prototype.isEmpty = function() {
  return this.showProperties.size == 0;
};

export const ResourceThroughLens = Record({
  uri: '',
  properties: new Map()
});
