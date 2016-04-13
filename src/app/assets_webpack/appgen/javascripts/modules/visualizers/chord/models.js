import { List, Record } from 'immutable';

export const Graph = Record({
  directed: false,
  nodeCount: 0,
  edgeCount: 0
});

export const NodeList = Record({
  id: '',
  name: 'Unlabeled list',
  uris: List()
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

